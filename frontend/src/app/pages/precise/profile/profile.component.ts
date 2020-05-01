import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import { PreciseStore, CommonStore, IParticipantForm } from "src/app/stores";
import * as Animations from "src/app/animations";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class PreciseProfileComponent {
  participantRevisions: IParticipantForm["entries"] = [];
  profileConfirmed = false;
  participantForms: IParticipantForm[];
  constructor(
    public store: PreciseStore,
    common: CommonStore,
    route: ActivatedRoute
  ) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId);
    common.setPageTitle(route.snapshot.params.participantId);
  }

  /**
   * Triggered on update from the template, set active participant and convert
   * key:value data to array for easier display
   */
  async participantUpdated() {
    console.log("participant updated");
    if (this.store.participantDataLoaded) {
      // full data from all linked tables has loaded
      this.participantForms = this.store.participantForms;
      this.participantRevisions = this.store.participantFormsHash.genInfoRevisions.entries;
      console.log("revisions", this.participantRevisions);
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
    this.store.editParticipant(this.store.activeParticipant);
  }
  viewRevisions() {
    alert(
      `${this.store.participantFormsHash.genInfoRevisions.entries.length} Revisions Recorded`
    );
  }
  /**
   * Launch a form, passing the participant f2_guid variable for pre-population
   */
  openForm(form: IFormMeta, editRowId?: string) {
    const { tableId, formId } = form;
    const { f2_guid } = this.store.activeParticipant;
    return this.store.launchForm(tableId, formId, editRowId, { f2_guid });
  }
}
