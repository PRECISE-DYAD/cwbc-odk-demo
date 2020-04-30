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

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class PreciseProfileComponent {
  participant: IParticipant = null;
  participantCollatedData: IParticipantCollatedData;
  sections = [
    {
      label: "Precise Visit",
      icon: "visit",
      url: "/visit",
    },
    {
      label: "Birth",
      icon: "baby",
      url: "/birth",
    },
    {
      label: "TOD",
      icon: "disease",
      url: "/tod",
    },
    {
      label: "Lab",
      icon: "lab",
      url: "/lab",
    },
  ];
  forms: IFormMeta[] = PARTICIPANT_FORMS;
  gridCols = Math.ceil(window.innerWidth / 200);
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
        completed:
          // TODO - can remove existence check when all forms defined
          this.participantCollatedData[f.tableId] &&
          this.participantCollatedData[f.tableId].length > 0
            ? true
            : false,
      }));
    }
  }

  handleProfileUpdate(shouldUpdate: boolean) {
    if (shouldUpdate) {
      this.editProfile();
    }
    this.profileConfirmed = true;
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
  openForm(form: IFormMeta) {
    // TODO - handle editing value
    const { tableId, formId } = form;
    const { f2_guid } = this.participant;
    // get editable row id if form already completed
    // TODO - add better handling for cases where there will be multiple instances
    const existing = form.completed
      ? this.participantCollatedData[tableId][0]._id
      : null;
    return this.store.launchForm(tableId, formId, existing, { f2_guid });
  }
}
