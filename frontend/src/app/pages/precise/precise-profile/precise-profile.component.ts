import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import { PreciseStore, CommonStore, IParticipantForm } from "src/app/stores";
import * as Animations from "src/app/animations";
import {
  ISectionWithMeta,
  PRECISE_FORM_SECTIONS,
  IPreciseFormSection,
  PRECISE_BABY_FORM_SECTION,
} from "src/app/models/precise.models";
import { toJS } from "mobx";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./precise-profile.component.html",
  styleUrls: ["./precise-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileComponent {
  participantRevisions: IParticipantForm["entries"] = [];
  profileConfirmed = false;
  participantForms: IParticipantForm[];
  sections: ISectionWithMeta[];
  expandedSections: any = {
    profile: true,
  };
  constructor(
    public store: PreciseStore,
    private route: ActivatedRoute,
    common: CommonStore
  ) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId);
    common.setPageTitle(route.snapshot.params.participantId);
    this._subscribeToParamChanges();
  }

  /**
   * Triggered on update from the template, set active participant and convert
   * key:value data to array for easier display
   */
  async participantUpdated() {
    if (this.store.participantDataLoaded) {
      // full data from all linked tables has loaded
      this.participantForms = this.store.participantForms;
      this.participantRevisions = this.store.participantFormsHash.profileSummaryRevisions.entries;
      this.loadParticipantSections();
    }
  }
  private loadParticipantSections() {
    this.sections = PRECISE_FORM_SECTIONS.map((s) => ({
      ...s,
      forms: s.formIds.map((formId) =>
        this.getFormWithEntries(formId as string)
      ),
    }));
    // Add sections for each recorded birth
    this.store.participantFormsHash.Birthbaby.entries.forEach((row) => {
      this._addBabySection(row.f2_guid_child);
    });
  }

  viewRevisions() {
    alert(
      `${this.store.participantFormsHash.profileSummaryRevisions.entries.length} Revisions Recorded`
    );
  }
  /**
   * Launch a form, passing the participant
   */
  openForm(form: IFormMeta, editRowId?: string) {
    return this.store.launchForm(form, editRowId);
  }

  /**
   * Given a formId return full form meta with entries
   */
  getFormWithEntries(formId: string): IParticipantForm {
    return toJS(this.store.participantFormsHash[formId]);
  }

  /**
   * Dynamically populate baby forms
   */
  private _addBabySection(f2_guid_child: string) {
    // default, push section to end
    const s: IPreciseFormSection = {
      ...PRECISE_BABY_FORM_SECTION,
      label: `Baby ${f2_guid_child.split("_").pop()}`,
    };
    let forms = s.formIds.map((formId) =>
      this.getFormWithEntries(formId as string)
    );
    forms = forms.map((f) => {
      // take all form entries and assign only those with matching baby guid
      const entries = f.entries.filter(
        (row) => row.f2_guid_child === f2_guid_child
      );
      return { ...f, entries };
    });
    this.sections.push({ ...s, forms });
  }

  /**
   * Query params are used to specify whether the participant is up-to-date or not
   * Handle changes to this by launching the survey edit form and/or hiding display sections
   */
  _subscribeToParamChanges() {
    this.route.queryParams.subscribe((params) => {
      const uptodate = params.uptodate;
      if (uptodate === "true") {
        this.profileConfirmed = true;
        this.expandedSections = {
          profile: false,
          precise: true,
        };
      } else {
        this.store.editParticipant(this.store.activeParticipant);
      }
    });
  }
}
