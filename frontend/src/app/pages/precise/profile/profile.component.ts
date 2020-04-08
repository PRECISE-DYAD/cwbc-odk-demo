import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IFormMeta } from "src/app/types/types";
import { PreciseStore, IParticipant, PARTICIPANT_FORMS } from "src/app/stores";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class PreciseProfileComponent {
  participant: IParticipant = null;
  participantFields: { fieldName: string; value: string }[] = [];
  participantTableData: { [tableId: string]: IODkTableRowData[] } = {};
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
    if (this.store.activeParticipant) {
      this.participant = this.store.activeParticipant;
      this.participantFields = this._objToFieldArray(this.participant);
      console.log("participant", { ...this.participant });
      this.processParticipant(this.participant);
    }
  }
  /**
   * After participant load process additional details
   */
  async processParticipant(participant: IParticipant) {
    // get all data rows
    this.participantTableData = await this.store.getParticipantTableData(
      participant
    );
    console.log("participant table data", this.participantTableData);
  }

  editProfile() {
    this.store.editParticipant(this.participant);
  }
  openForm(form: IFormMeta) {
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
  markCompletedForms() {
    // this.forms = this.forms.map(f => ({
    //   ...f,
    //   completed: this.details[`completed_${f.formId}`] ? true : false
    // }));
  }

  private _objToFieldArray(obj: { [field: string]: string }) {
    return Object.entries(obj).map(([fieldName, value]) => {
      return { fieldName, value };
    });
  }
}
