import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Animations from "src/app/modules/shared/animations";
import { DYAD_SUMMARY_FIELDS } from "../../models/dyad-summary.model";
import {
  DYAD_CHILD_FORM_SECTIONS,
  DYAD_FORM_SECTIONS,
  IDyadParticipantChild,
} from "../../models/dyad.models";
import { DyadService } from "../../services";

@Component({
  selector: "app-dyad-profile",
  templateUrl: "./dyad-profile.component.html",
  styleUrls: ["./dyad-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class DyadProfileComponent implements OnDestroy, OnInit {
  formSections = DYAD_FORM_SECTIONS;
  childFormSections = DYAD_CHILD_FORM_SECTIONS;
  dyadSummaryFields = DYAD_SUMMARY_FIELDS;

  constructor(public dyadService: DyadService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.init();
  }
  ngOnDestroy() {
    this.dyadService.setActiveParticipantById(
      this.route.snapshot.params.f2_guid
    );
  }

  public launchChildForm(
    formId: string,
    editRowId: string,
    child: IDyadParticipantChild
  ) {
    const { f2_guid_child } = child;
    const formMeta = this.dyadService.participantFormsHash[formId];
    this.dyadService.launchForm(formMeta, editRowId, { f2_guid_child });
  }

  private async init() {
    await this.dyadService.isReady();
    await this.dyadService.setActiveParticipantById(
      this.route.snapshot.params.f2_guid
    );
    this.generateChildSections();
  }

  private generateChildSections() {
    const { dyad_enrollment } = this.dyadService.activeParticipantData;
  }
}
