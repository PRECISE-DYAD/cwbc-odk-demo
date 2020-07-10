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
    if (this.store.participantDataLoaded) {
      // full data from all linked tables has loaded
      this.participantForms = this.store.participantForms;
      this.participantRevisions = this.store.participantFormsHash.profileSummaryRevisions.entries;
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
      `${this.store.participantFormsHash.profileSummaryRevisions.entries.length} Revisions Recorded`
    );
  }
  /**
   * Launch a form, passing the participant
   */
  openForm(form: IFormMeta, editRowId?: string) {
    return this.store.launchForm(form, editRowId);
  }
}
