import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import * as IPrecise from "src/app/modules/precise/types";
import { environment } from "src/environments/environment";
import {
  DYAD_SCHEMA,
  IDyadParticipantSummary,
  IDyadParticipantData,
  IDyadParticipantChild,
  IFormSchema,
  IDyadMappedField,
  IDyadParticipant,
} from "../models/dyad.models";
import { _arrToHashmap } from "../../shared/utils";
import { BehaviorSubject } from "rxjs";
import { IODkTableRowData } from "../../shared/types";
import { ActivatedRoute, Router } from "@angular/router";

/**
 * Create a new object that contains all the mappings selectable from
 * legacy names (e.g. MAPPED_SCHEMA.visit1.tableId = visit1_v2)
 */
const MAPPED_SCHEMA: typeof DYAD_SCHEMA = {} as any;
Object.entries(DYAD_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});

@Injectable({ providedIn: "any" })
/**
 * Note - borrows heavily from precise service. At some point will probably want to merge
 * or create instantiable class
 */
export class DyadService {
  allParticipants: IDyadParticipantSummary[] = [];
  activeParticipant: IDyadParticipant;
  private _dataLoaded$ = new BehaviorSubject(false);
  constructor(private odk: OdkService) {
    this.init();
  }

  async init() {
    await this.loadParticipants();
    this._dataLoaded$.next(true);
  }
  /**
   * Promise to indicate when initial data has been loaded
   */
  async isReady() {
    return this._dataLoaded$.pipe(takeWhile((ready) => ready === false)).toPromise();
  }

  async setActiveParticipantById(f2_guid?: string) {
    if (f2_guid) {
      const formsHash: IDyadParticipant["formsHash"] = await this.loadParticipantFormsHash(f2_guid);
      const data: IDyadParticipant["data"] = this.formsHashToParticipantData(formsHash);
      const participant: IDyadParticipant = {
        f2_guid,
        data,
        formsHash,
        children: [],
      };
      participant.children = this.loadParticipantChildMeta(participant);
      participant.formsHash = this.evaluateDisabledForms(participant);
      this.activeParticipant = participant;
      console.log("active participant", this.activeParticipant);
      await this.updateParticipantMappedData(this.activeParticipant);
    } else {
      this.activeParticipant = null;
    }
  }

  private async updateParticipantMappedData(participant: IDyadParticipant) {
    const updates = Object.entries(MAPPED_SCHEMA).map(async ([table_id, schema]) => {
      const writtenMapFields = (schema.mapFields || []).filter((f) => f.write_updates);
      const { f2_guid } = this.activeParticipant;
      if (writtenMapFields.length > 0) {
        if (schema.is_child_form) {
          // Handle child forms iteratively
          for (const child of this.activeParticipant.children) {
            const { data, f2_guid_child } = child;
            const rows = data[table_id]._rows;
            if (rows.length == 0 && schema.allow_new_mapFields_row) {
              await this.odk.addRow(table_id, { f2_guid, f2_guid_child }, f2_guid_child);
              return this.setActiveParticipantById(f2_guid);
            } else {
              for (const row of rows) {
                const updateEntry = this.comparedMappedFieldData(row, writtenMapFields, child.data);
                // note - if row identical odk also provides own check whether for sql updates required, so not strictly required
                if (Object.keys(updateEntry).length > 0) {
                  await this.odk.updateRow(table_id, row._id, { ...row, ...updateEntry });
                }
              }
            }
          }
        } else {
          // handle mother forms
          const rows = participant.data[table_id]._rows;
          // handle new row creation where permitted
          if (rows.length == 0 && schema.allow_new_mapFields_row) {
            await this.odk.addRow(table_id, { f2_guid }, f2_guid);
            return this.setActiveParticipantById(f2_guid);
          } else {
            for (const row of rows) {
              const updateEntry = this.comparedMappedFieldData(
                row,
                writtenMapFields,
                participant.data
              );
              // note - if row identical odk also provides own check whether for sql updates required, so not strictly required
              if (Object.keys(updateEntry).length > 0) {
                await this.odk.updateRow(table_id, row._id, { ...row, ...updateEntry });
              }
            }
          }
        }
      }
    });
    await Promise.all(updates);
  }

  private comparedMappedFieldData(row, mapFields, participantData) {
    const updatedFields: any = {};
    for (const mapField of mapFields) {
      const { field, value } = this._evaluateMappedField(mapField, participantData);
      const existingValue = row[field];
      if (existingValue !== value) {
        updatedFields[field] = value;
      }
    }
    return updatedFields;
  }

  /**
   * Enrol an existing participant to the Dyad programme, or load a previously
   * opted-out participant for editing
   */
  async enrolParticipant(
    router: Router,
    route: ActivatedRoute,
    participant: IDyadParticipantSummary
  ) {
    console.log("enrol participant", participant);
    const { precise_profileSummary, dyad_consent } = participant;
    const { f2_guid } = precise_profileSummary;
    // open form for editing if entry already exists
    const editRowId = dyad_consent ? dyad_consent._id : null;
    // open the form for editing or creating new entry
    // allow access to profile summary data (rest of participant forms wont be loaded yet)
    // NOTE - if profile summary ever renamed this will have to be manually updated
    await this.launchForm(MAPPED_SCHEMA.dyad_consent, editRowId, {
      f2_guid,
      data: { profileSummary: precise_profileSummary },
    } as any);
    // navigate to expected profile page to display after enrollment complete
    // note - assumes form will not just be dismissed (could be refined)
    router.navigate([f2_guid], { relativeTo: route });
  }

  /**
   * Load all participants availble with Precise profiles and merge with Dyad consent data
   */
  private async loadParticipants() {
    await this.odk.ready$.pipe(takeWhile((isReady) => !isReady)).toPromise();
    const dyadProfiles = await this.odk.getTableRows(MAPPED_SCHEMA.dyad_consent.tableId);
    const dyadProfileHash = _arrToHashmap(dyadProfiles, "f2_guid");
    const preciseProfiles = await this.odk.getTableRows<IPrecise.IParticipant>(
      MAPPED_SCHEMA.profileSummary.tableId
    );
    this.allParticipants = preciseProfiles.map((p) => ({
      precise_profileSummary: p,
      dyad_consent: dyadProfileHash[p.f2_guid] || null,
    }));
    console.log("all participant summaries", this.allParticipants);
  }

  /**
   * Launch a form in ODK survey, optionally providing an existing rowId to
   * open an existing form (otherwise creates a new entry).
   * Additionally pipe any key-value data pairs to the form, and automatically
   * update piped data when re-opening in edit mode
   * @param editRowId - row to load into survey for editing
   * @param jsonMap - fields to prepopulate
   * NOTE - f2_guid automatically populated for all forms
   * NOTE - any additional fields listed in formMeta also populated
   */
  public async launchForm(
    formMeta: IFormSchema,
    editRowId: string = null,
    participant?: IDyadParticipant | IDyadParticipantChild
  ) {
    console.log("launch form", participant);
    // all forms should be linked to a participant. Even if registering new participant, should
    // provide a placeholder f2_guid
    participant = participant || this.activeParticipant;
    let { tableId, formId, is_child_form } = formMeta;
    // ensure table and form ids have been properly mapped
    // note - avoid full lookup in case modified mapped fields have been pass (e.g. baby section forms)
    tableId = environment.tableMapping[tableId] || tableId;
    formId = environment.formMapping[formId] || formId;
    // assign mapped data
    let jsonMap: any = {};
    jsonMap = { ...jsonMap, ...this._generateMappedFields(formMeta.mapFields, participant.data) };
    if (is_child_form) {
      const { f2_guid_child, mother } = participant as IDyadParticipantChild;
      jsonMap.f2_guid_child = f2_guid_child;
      jsonMap.f2_guid = mother.f2_guid;
    } else {
      const { f2_guid } = participant as IDyadParticipant;
      jsonMap.f2_guid = f2_guid;
    }
    // launch form

    if (editRowId) {
      console.log("edit row", { tableId, formId, editRowId, jsonMap });
      // manually update piped fields in case of changes
      await this.odk.updateRow(tableId, editRowId, jsonMap);
      return this.odk.editRowWithSurvey(tableId, editRowId, formId);
    } else {
      console.log("new row", { tableId, formId, jsonMap });
      return this.odk.addRowWithSurvey(tableId, formId, editRowId, jsonMap);
    }
  }

  /**
   * query batch to get rows from other tables linked by participant guid
   */
  private async loadParticipantFormsHash(f2_guid: string) {
    const collated: IDyadParticipant["formsHash"] = {} as any;
    const promises = Object.entries(MAPPED_SCHEMA).map(async ([key, formMeta]) => {
      const { tableId } = formMeta;
      // lookup the data for every table given by the mapped table id
      let participantRows: IODkTableRowData[];
      try {
        participantRows = await this.odk.query(
          tableId,
          "f2_guid = ?",
          [f2_guid],
          // skip odk error notifications and just handle below
          (err) => null
        );
      } catch (error) {
        // either table does not exist or no f2_guid field - likely issue but could be exceptions
        console.error("could not query user records:", formMeta.tableId, f2_guid);
      }
      const entries = participantRows || [];
      // attach metadata
      collated[tableId] = { ...formMeta, entries };
      // duplicate data to pre-mapped table id for use in lookups
      collated[key] = { ...formMeta, tableId: key, entries };
    });
    await Promise.all(promises);
    return collated;
  }

  /**
   * Create repeat groups for nesting child data based on Birthbaby entries
   * Create formHash with baby entries alongside data object for use in calculations
   */
  private loadParticipantChildMeta(mother: IDyadParticipant) {
    const children: IDyadParticipantChild[] = [];
    // Use birthmother entries to populate children
    for (const entry of mother.formsHash.Birthbaby.entries) {
      const { f2_guid_child } = entry;
      // Generate forms hashmap with filtered entry for child
      const formsHash: any = {};
      const childForms = Object.values(DYAD_SCHEMA).filter((s) => s.is_child_form);
      for (const form of childForms) {
        const { formId } = form;
        const formMeta = mother.formsHash[formId];
        formsHash[formId] = {
          ...formMeta,
          entries: formMeta.entries.filter((e) => e.f2_guid_child === f2_guid_child),
        };
      }
      // populate child data for use in calculation
      const data = this.formsHashToParticipantData(formsHash) as any;
      // also make mother data available in child calculations
      data._mother = mother.data;
      const child: IDyadParticipantChild = { formsHash, f2_guid_child, data, mother };
      child.formsHash = this.evaluateDisabledForms(child);
      children.push(child);
    }
    console.log("participant children", children);
    return children;
  }

  /**
   * Evaluate any logic from a formschema's disabled calculation function, and map back
   * to formschema calculated _disabled and _disabled_msg fields
   */
  private evaluateDisabledForms(participant: IDyadParticipant | IDyadParticipantChild) {
    const { data, formsHash } = participant;
    Object.entries(formsHash).forEach(([tableId, schema]) => {
      if (schema.hasOwnProperty("disabled") && typeof schema.disabled === "function") {
        try {
          const evaluation = schema.disabled(data);
          formsHash[tableId]._disabled = evaluation ? true : false;
          if (evaluation && typeof evaluation === "string") {
            formsHash[tableId]._disabled_msg = evaluation;
          }
        } catch (error) {
          console.group(`[${tableId}] - Error evaluating disabled function`);
          console.error(error.message);
          console.log("function:", schema.disabled);
          console.log("data:", data);
          console.groupEnd();
        }
      }
    });
    return formsHash;
  }

  /**
   * Create a dynamic function to parse the calculation expression without
   * the nees for `eval()` operator
   */
  private _parseExpression(data: any = {}, str: string) {
    const args = "data, str";
    const body = `'use strict'; return (${str})`;
    return new Function(args, body).apply(null, [data, str]);
  }

  /**
   *  Take the full list of forms and entries for the active participant and collate all values
   *  into nested json for faster lookup.
   *  Additionally include a backwards map so that values can be accessed directly via table map names
   *
   * NOTE - in the case of multiple entries takes only the most recent, therefore an extra `_rows`
   * property has been added where raw entries can be accessed
   */
  private formsHashToParticipantData(formsHash: IDyadParticipant["formsHash"]) {
    const data: any = {};
    for (const form of Object.values(formsHash)) {
      const { tableId } = form;
      if (!data[tableId]) {
        data[tableId] = { _rows: form.entries };
      }
      // Ignore automatic checkpoints (null checkpoint) when determining the latest entry
      const savedEntries = form.entries.filter((r) => r._savepoint_type !== null);
      const latestEntry = savedEntries[savedEntries.length - 1];
      if (latestEntry) {
        Object.entries(latestEntry).forEach(([key, value]) => {
          data[tableId][key] = value;
        });
      }
    }
    const mapped: IDyadParticipantData = data;
    return mapped;
  }

  /**
   * Lookup specific table-field values to pass when launching a form
   * @param mapFields - Array of objects containing table_id, field_name and
   * optional mapped_field_name to retrieve and return
   * NOTE - in case of multiple table entries returns only first entry
   */
  private _generateMappedFields(mapFields: IDyadMappedField[] = [], data: IDyadParticipantData) {
    const mapping = {};
    for (const mapField of mapFields) {
      const { field, value } = this._evaluateMappedField(mapField, data);
      if (field) {
        mapping[field] = value || null;
      }
    }
    return mapping;
  }

  /**
   * Takes a mappedField object and relevant participant data
   * to calculate a value for the given summary
   * TODO - code should be merged with field-summary.ts component logic
   */
  private _evaluateMappedField(mappedField: IDyadMappedField, data: IDyadParticipantData) {
    let { tableId, field, calculation, mapped_field_name } = mappedField;
    // direct lookup
    let value: any;
    if (tableId && field) {
      value = data[tableId][field];
    }
    // calculation
    if (calculation) {
      try {
        if (typeof calculation === "string") {
          value = this._parseExpression(data, calculation);
        } else {
          value = calculation(data);
        }
      } catch (error) {
        console.warn("could not evaluate", calculation, error, data);
        value = "ERR";
      }
    }
    // apply any field name changes
    field = mapped_field_name || field;
    return { field, value };
  }
}
