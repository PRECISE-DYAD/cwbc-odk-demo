import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IODkTableRowData } from "src/app/types/odk.types";
import ALL_FORMS from "src/app/data/forms.json";
import { IFormMeta } from "src/app/types/types";
import { PreciseStore, IParticipant } from 'src/app/stores';

@Component({
  selector: "app-precise-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class PreciseProfileComponent {
  details: IODkTableRowData | IParticipant = null;
  detailsMetaArr: any[] = [];
  detailsArr: any[] = [];
  forms: IFormMeta[] = ALL_FORMS;
  gridCols = Math.ceil(window.innerWidth / 200);
  constructor(public store: PreciseStore, route: ActivatedRoute) {
    this.store.setActiveParticipantById(route.snapshot.params.participantId)
  }

  participantLoaded() {
    if (this.store.activeParticipant) {
      this.details = this.store.activeParticipant
      this.detailsMetaArr = Object.entries(this.store.activeParticipant)
      console.log('details', this.details)
    }

  }


  editProfile() {
    // const { _id, _form_id } = this.details;
    // this.odk.editRowWithSurvey("profile", _id, _form_id);
  }
  openForm(form: IFormMeta) {
    // const { tableId, formId } = form;
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
  // async _bindOdkRowElementData() {
  //   const allRows = await this.odk.getTableRows("profile");
  //   const { participantId } = this.route.snapshot.params;
  //   this.details = allRows.find(row => row._id === participantId);
  //   this.detailsArr = Object.entries(this.details).filter(
  //     el => el[0][0] !== "_"
  //   );
  //   this.detailsMetaArr = Object.entries(this.details).filter(
  //     el => el[0][0] === "_"
  //   );
  // }
}
