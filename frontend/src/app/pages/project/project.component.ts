import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonStore } from "src/app/stores/common.store";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent {
  tableColumns: string[] = ["phoneNum", "ptid"];
  constructor(
    store: CommonStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    store.setProjectById(this.route.snapshot.params.projectId);
  }

  handleRowClick(row: IODkTableRowData) {
    this.router.navigate([row._id], { relativeTo: this.route });
  }
}
