import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonStore } from "src/app/stores/common.store";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "app-precise-home",
  templateUrl: "./precise.component.html",
  styleUrls: ["./precise.component.scss"]
})
export class PreciseHomeComponent {
  tableColumns: string[] = ["phoneNum", "ptid"];
  constructor(
    store: CommonStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    store.setProjectById("precise");
  }

  handleRowClick(row: IODkTableRowData) {
    this.router.navigate([row._id], { relativeTo: this.route });
  }
}
