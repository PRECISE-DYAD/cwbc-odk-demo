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

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class PreciseProfileComponent {
  participant: IParticipant = null;
  participantFields: { fieldName: string; value: string }[] = [];
  participantCollatedData: IParticipantCollatedData;
  forms: IFormMeta[] = PARTICIPANT_FORMS;
  gridCols = Math.ceil(window.innerWidth / 200);
  participantRevisions: IParticipant[];
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
      this.participantFields = this._objToFieldArray(this.participant);
    }
    // full data from all linked tables has loaded
    if (this.store.participantCollatedData) {
      this.participantCollatedData = this.store.participantCollatedData;
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

  private _objToFieldArray(obj: { [field: string]: string }) {
    return Object.entries(obj).map(([fieldName, value]) => {
      return { fieldName, value };
    });
  }
}
