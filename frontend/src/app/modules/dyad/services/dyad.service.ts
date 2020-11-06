import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { PRECISE_SCHEMA } from "src/app/modules/precise/models";
import * as IPrecise from "src/app/modules/precise/types";
import { environment } from "src/environments/environment";
import { DYAD_SCHEMA } from "../models/dyad.models";
import { _arrToHashmap } from "../../shared/utils";

/**
 * Create a new object that contains all the mappings selectable from
 * legacy names (e.g. MAPPED_SCHEMA.visit1.tableId = visit1_v2)
 */
const MAPPED_SCHEMA: typeof PRECISE_SCHEMA & typeof DYAD_SCHEMA = {} as any;
Object.entries(PRECISE_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});
Object.entries(DYAD_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});

@Injectable({ providedIn: "any" })
export class DyadService {
  participantSummaries = [];
  constructor(private odk: OdkService) {
    this.loadParticipants();
  }

  /**
   * Load all participants availble with Precise profiles and merge with Dyad enrollment data
   */
  async loadParticipants() {
    const dyadProfiles = await this.odk.getTableRows(
      MAPPED_SCHEMA.dyad_enrollment.tableId
    );
    console.log("dyad profiles", dyadProfiles);
    const dyadProfileHash = _arrToHashmap(dyadProfiles, "f2_guid");
    await this.odk.ready$.pipe(takeWhile((isReady) => !isReady)).toPromise();
    const preciseProfiles = await this.odk.getTableRows<IPrecise.IParticipant>(
      MAPPED_SCHEMA.profileSummary.tableId
    );
    this.participantSummaries = preciseProfiles.map((p) => ({
      ...p,
      dyad_enrollment: dyadProfileHash[p.f2_guid] || null,
    }));
    console.log("precise profiles", preciseProfiles);
  }
}
