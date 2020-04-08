import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import ALL_FORMS from "src/app/data/forms.json";
import { IFormMeta } from "src/app/types/types";
import { PreciseStore, IParticipant } from "src/app/stores";

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class PreciseProfileComponent {
  details: IParticipant = null;
  detailsMetaArr: any[] = [];
  detailsArr: any[] = [];
  forms: IFormMeta[] = ALL_FORMS;
  gridCols = Math.ceil(window.innerWidth / 200);
  participantRevisions: IParticipant[];
  constructor(public store: PreciseStore, route: ActivatedRoute) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId);
  }

  async participantLoaded() {
    if (this.store.activeParticipant) {
      this.details = this.store.activeParticipant;
      this.detailsMetaArr = Object.entries(this.store.activeParticipant);
      this.participantRevisions = await this.store.getParticipantRevisions();
    }
  }

  editProfile() {
    this.store.editParticipant(this.details);
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
}
