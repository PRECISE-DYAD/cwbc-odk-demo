import { Component, OnInit } from "@angular/core";
import { OdkService } from "src/app/services/odk.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {
  constructor(private odk: OdkService, private route: ActivatedRoute) {
    this.odk.setProjectByName(this.route.snapshot.params.projectName);
  }

  ngOnInit(): void {}
  get project() {
    return this.odk.activeProject.value;
  }
}
