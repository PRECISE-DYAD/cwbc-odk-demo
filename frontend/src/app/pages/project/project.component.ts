import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonStore } from "src/app/stores/common.store";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent {
  tableColumns: string[] = ["_id", "name"];
  constructor(store: CommonStore, private route: ActivatedRoute) {
    store.setProjectById(this.route.snapshot.params.projectId);
  }
}
