import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Animations from "src/app/modules/shared/animations";
import { DYAD_SUMMARY_FIELDS } from "../../models/dyad-summary.model";
import {
  DYAD_CHILD_FORM_SECTIONS,
  DYAD_FORM_SECTIONS,
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

  private async init() {
    await this.dyadService.isReady();
    console.log(
      "service ready, setting participant",
      this.route.snapshot.params.f2_guid
    );
    await this.dyadService.setActiveParticipantById(
      this.route.snapshot.params.f2_guid
    );
    console.log("profile loaded", this.dyadService);
  }
}
