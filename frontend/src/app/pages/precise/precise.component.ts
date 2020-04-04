import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonStore } from "src/app/stores/common.store";
import { IODkTableRowData } from "src/app/types/odk.types";
import { MatPaginator } from "@angular/material/paginator";
import { PreciseStore, IParticipantSummary } from "src/app/stores";
import { MatTableDataSource } from "@angular/material/table";

/**
 * Homepage of precise project
 * TODO - move table/list display to odk component
 */
@Component({
  selector: "app-precise-home",
  templateUrl: "./precise.component.html",
  styleUrls: ["./precise.component.scss"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreciseHomeComponent implements OnInit {
  participants: any[];
  columns = ["f2a_participant_id"];
  dataSource: MatTableDataSource<IParticipantSummary>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private commonStore: CommonStore,
    public store: PreciseStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.commonStore.setProjectById("precise");
  }
  /**
   * Triggered as a reaction from component when new data available from store
   * Load as a table data source.
   */
  setDatasource() {
    this.dataSource = new MatTableDataSource(this.store.participantSummaries$);
    this.dataSource.paginator = this.paginator;
  }

  addRecord() {
    console.log("adding record");
    this.store.launchParticipantForm();
  }

  applyFilter($event) {}

  handleRowClicked(row: IODkTableRowData) {
    console.log("row clicked", row);
    this.router.navigate([row.f2a_participant_id], { relativeTo: this.route });
  }
}
