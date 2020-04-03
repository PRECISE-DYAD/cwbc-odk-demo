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
  tableColumns: string[] = [
    "f2a_participant_id",
    "f2a_full_name",
    "f2a_national_id",
    "f2a_hdss",
    "f2a_phone",
    "f2a_phone_number",
    "f2a_phone_2",
    "f2a_phone_number_2"
  ];
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
