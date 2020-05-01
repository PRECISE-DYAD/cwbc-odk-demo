import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import {
  PreciseStore,
  IParticipant,
  PARTICIPANT_FORMS,
  IParticipantCollatedData,
  CommonStore,
} from "src/app/stores";
import { toJS } from "mobx";
import * as Animations from "src/app/animations";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileComponent {
  participant: IParticipant = null;
  participantCollatedData: IParticipantCollatedData;

  forms: IFormMeta[] = PARTICIPANT_FORMS.map((f) => ({ ...f, entries: [] }));

  participantRevisions: IParticipant[] = [];
  profileConfirmed = false;
  constructor(
    public store: PreciseStore,
    route: ActivatedRoute,
    public common: CommonStore
  ) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId);
    this.common.setPageTitle(route.snapshot.params.participantId);
  }

  /**
   * Triggered on update from the template, set active participant and convert
   * key:value data to array for easier display
   */
  async participantLoaded() {
    // participant has loaded
    if (this.store.activeParticipant) {
      this.participant = this.store.activeParticipant;
    }
    // full data from all linked tables has loaded
    if (this.store.participantCollatedData) {
      this.participantCollatedData = this.store.participantCollatedData;
      this.participantRevisions = toJS(
        this.participantCollatedData.genInfoRevisions
      ) as IParticipant[];
      this.forms = this.forms.map((f) => ({
        ...f,
        entries: toJS(this.participantCollatedData[f.tableId]),
      }));
      console.log("forms", this.forms);
    }
  }

  handleProfileUpdate(shouldUpdate: boolean) {
    if (shouldUpdate) {
      return this.editProfile();
    } else {
      this.profileConfirmed = true;
    }
  }

  editProfile() {
    this.store.editParticipant(this.participant);
  }
  viewRevisions() {
    alert(
      `${this.participantCollatedData.genInfoRevisions.length} Revisions Recorded`
    );
  }
  /**
   * Launch a form, passing the participant f2_guid variable for pre-population
   */
  openForm(form: IFormMeta, editRowId?: string) {
    const { tableId, formId } = form;
    const { f2_guid } = this.participant;
    return this.store.launchForm(tableId, formId, editRowId, { f2_guid });
  }
}
