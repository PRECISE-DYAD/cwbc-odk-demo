import { Component } from "@angular/core";
import ALL_PROJECTS from "../../data/projects.json";
import { IProjectMeta } from "src/app/types/types.js";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  projects: IProjectMeta[] = ALL_PROJECTS;
}
