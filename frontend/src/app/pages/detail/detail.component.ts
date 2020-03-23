import { Component } from "@angular/core";
import { OdkService } from "src/app/services/odk/odk.service";
import { ActivatedRoute } from "@angular/router";
import { IODkTableRowData } from "src/app/types/odk.types";
import ALL_FORMS from "src/app/data/forms.json";
import { IFormMeta } from "src/app/types/types";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent {
  details: IODkTableRowData = null;
  detailsMetaArr: any[] = [];
  detailsArr: any[] = [];
  forms: IFormMeta[] = ALL_FORMS;
  gridCols = Math.ceil(window.innerWidth / 200);
  constructor(private odk: OdkService, private route: ActivatedRoute) {
    this.init();
  }

  async init() {
    await this._bindOdkRowElementData();
    this.markCompletedForms();
  }

  editProfile() {
    const { _id, _form_id } = this.details;
    this.odk.editRowWithSurvey("profile", _id, _form_id);
  }
  openForm(form: IFormMeta) {
    const { tableId, formId } = form;
    return form.completed
      ? this.odk.editRowWithSurvey(tableId, this.details._id, formId)
      : this.odk.addRowWithSurvey(tableId, formId, null, {
          // specify corresponding form ids to match this one
          // TODO - doocument parent-child linking (and revise possible strategies)
          _id: this.details._id
        });
  }
  markCompletedForms() {
    this.forms = this.forms.map(f => ({
      ...f,
      completed: this.details[`completed_${f.formId}`] ? true : false
    }));
  }
  async _bindOdkRowElementData() {
    const allRows = await this.odk.getTableRows("profile");
    const { participantId } = this.route.snapshot.params;
    this.details = allRows.find(row => row._id === participantId);
    this.detailsArr = Object.entries(this.details).filter(
      el => el[0][0] !== "_"
    );
    this.detailsMetaArr = Object.entries(this.details).filter(
      el => el[0][0] === "_"
    );
  }
}
