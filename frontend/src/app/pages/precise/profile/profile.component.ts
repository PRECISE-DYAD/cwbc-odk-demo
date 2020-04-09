import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import {
  PreciseStore,
  IParticipant,
  PARTICIPANT_FORMS,
  IParticipantCollatedData,
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
  constructor(public store: PreciseStore, route: ActivatedRoute) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId);
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
        completed: this.participantCollatedData[f.tableId] ? true : false,
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
  openForm(form: IFormMeta) {
    // TODO - handle editing value
    const { tableId, formId } = form;
    return this.store.launchForm(tableId, formId);
    // return form.completed
    //   ? this.odk.editRowWithSurvey(tableId, this.details._id, formId)
    //   : this.odk.addRowWithSurvey(tableId, formId, null, {
    //     // specify corresponding form ids to match this one
    //     // TODO - doocument parent-child linking (and revise possible strategies)
    //     ptid: this.details.ptid
    //   });
  }

  private _objToFieldArray(obj: { [field: string]: string }) {
    return Object.entries(obj).map(([fieldName, value]) => {
      return { fieldName, value };
    });
  }
}
