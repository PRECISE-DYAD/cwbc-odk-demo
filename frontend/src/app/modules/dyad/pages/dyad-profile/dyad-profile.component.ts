import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Animations from "src/app/modules/shared/animations";
import {
  DYAD_FORM_SECTIONS,
  DYAD_SCHEMA,
  IDyadParticipantChild,
  IFormSchema,
} from "../../models/dyad.models";
import { DyadService } from "../../services";

@Component({
  selector: "app-dyad-profile",
  templateUrl: "./dyad-profile.component.html",
  styleUrls: ["./dyad-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class DyadProfileComponent implements OnDestroy, OnInit {
  /** form sections list formIds to show alongside merged schema meta */
  formSections = DYAD_FORM_SECTIONS.map((section) => ({
    ...section,
    formSchema: section.formIds.map((id) => ({ ...DYAD_SCHEMA[id], id })),
  }));

  constructor(public dyadService: DyadService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.init();
    console.log("form sections", this.formSections);
  }
  ngOnDestroy() {
    this.dyadService.setActiveParticipantById(this.route.snapshot.params.f2_guid);
  }

  public launchChildForm(formSchema: IFormSchema, editRowId: string, child: IDyadParticipantChild) {
    const { f2_guid_child } = child;
    this.dyadService.launchForm(formSchema, editRowId, { f2_guid_child });
  }

  private async init() {
    await this.dyadService.isReady();
    await this.dyadService.setActiveParticipantById(this.route.snapshot.params.f2_guid);
  }
}
