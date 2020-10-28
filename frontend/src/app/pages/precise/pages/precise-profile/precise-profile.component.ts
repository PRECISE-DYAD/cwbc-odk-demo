import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import {
  PreciseStore,
  CommonStore,
  IFormMetaWithEntries,
  IParticipant,
} from "src/app/stores";
import * as Animations from "src/app/animations";
import {
  ISectionWithMeta,
  PRECISE_FORM_SECTIONS,
  PRECISE_BABY_FORM_SECTION,
} from "src/app/models/precise.models";
import { Subscription } from "rxjs";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./precise-profile.component.html",
  styleUrls: ["./precise-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileComponent implements OnDestroy, OnInit {
  participantRevisions: IFormMetaWithEntries["entries"] = [];
  profileConfirmed = false;
  sections: { [sectionID: string]: ISectionWithMeta };
  babySections: ISectionWithMeta[] = [];
  expandedSections: any = {
    profile: true,
  };
  params$: Subscription;
  constructor(
    public store: PreciseStore,
    private route: ActivatedRoute,
    private commonStore: CommonStore
  ) {}
  ngOnDestroy() {
    this.store.clearActiveParticipant();
    this.params$.unsubscribe();
  }
  ngOnInit() {
    this.store.setActiveParticipantById(this.route.snapshot.params.f2_guid);
    this.params$ = this._subscribeToParamChanges();
  }

  /**
   * Triggered on update from the template, set active participant and convert
   * key:value data to array for easier display
   */
  async participantUpdated() {
    if (this.store.participantDataLoaded) {
      this.setPageTitle(this.store.activeParticipant);
      // full data from all linked tables has loaded
      this.participantRevisions = this.store.participantFormsHash.profileSummaryRevisions.entries;
      this.loadParticipantSections();
      this.loadParticipantBabySections();
    }
  }

  private setPageTitle(activeParticipant: IParticipant) {
    const { f2a_full_name, f2a_participant_id } = activeParticipant;
    this.commonStore.setPageTitle(`${f2a_participant_id} ${f2a_full_name}`);
  }
  private loadParticipantSections() {
    const sections: { [sectionID: string]: ISectionWithMeta } = {};
    PRECISE_FORM_SECTIONS.forEach((s) => {
      const sectionWithMeta = {
        ...s,
        forms: s.formIds.map((formId) =>
          this.getFormWithEntries(formId as string)
        ),
      };
      sections[s._id] = sectionWithMeta;
    });
    this.sections = sections;
  }
  /**
   * Create a baby section entry with any baby forms
   */
  private loadParticipantBabySections() {
    // Add placeholders for additional children recorded
    const numberOfBabies =
      this.store.participantFormsHash.Birthmother.entries[0]
        ?.f7_delivery_num_of_babies || 1;
    // add any additional sections if more babies specified
    const { f2_guid } = this.store.activeParticipant;
    const expectedEntries = new Array(numberOfBabies)
      .fill(0)
      .map((_, childIndex) => `${f2_guid}_${childIndex + 1}`);
    expectedEntries.forEach((f2_guid_child) => {
      const section = this._generateBabySection(f2_guid_child);
      this.babySections.push(section);
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
  getFormWithEntries(formId: string): IFormMetaWithEntries {
    return this.store.participantFormsHash[formId];
  }

  /**
   * Dynamically populate baby forms, filtering all form entries to only include specific
   * child guid and add field mapping to pass child guid to all forms
   */
  private _generateBabySection(f2_guid_child: string) {
    const babyForms = PRECISE_BABY_FORM_SECTION.formIds.map((formId) => {
      const formWithAllEntries = this.getFormWithEntries(formId as string);
      // filter all form entries to only include those with matching child guid
      const childEntries = formWithAllEntries.entries.filter(
        (row) => row.f2_guid_child === f2_guid_child
      );
      // add additional map field for piping child guid
      const mapFields = [
        ...formWithAllEntries.mapFields,
        {
          field_name: "f2_guid_child",
          value: f2_guid_child,
          table_id: null,
        },
      ];
      return { ...formWithAllEntries, entries: childEntries, mapFields };
    });
    // populate label from Birthbaby entry (if available)
    const { entries } = babyForms.find((f) => f.formId === "Birthbaby");
    const label = entries[0]?.f9_baby_id || f2_guid_child.split("_").pop();
    const section: ISectionWithMeta = {
      ...PRECISE_BABY_FORM_SECTION,
      label,
      forms: babyForms,
    };
    return section;
  }

  /**
   * Query params are used to specify whether the participant is up-to-date or not
   * Handle changes to this by launching the survey edit form and/or hiding display sections
   */
  _subscribeToParamChanges() {
    return this.route.queryParams.subscribe((params) => {
      const uptodate = params.uptodate;
      if (uptodate === "true") {
        this.profileConfirmed = true;
        this.expandedSections = {
          profile: false,
          precise: true,
        };
      }
      if (uptodate === "false") {
        this.store.editParticipant(this.store.activeParticipant);
      }
    });
  }
}
