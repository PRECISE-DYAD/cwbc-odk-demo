import { Component } from "@angular/core";
import ALL_PROJECTS from "../../data/projects.json";
import { IProjectMeta } from "src/app/types/types.js";
import { OdkService } from "src/app/services/odk/odk.service.js";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  projects: IProjectMeta[] = ALL_PROJECTS;

  constructor(private odk: OdkService) {}
  test() {
    this.odk.getTableRows("exampleTable");
  }
}
