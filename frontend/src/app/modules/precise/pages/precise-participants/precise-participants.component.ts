import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { PreciseStore } from "src/app/modules/precise/stores";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { EnrollmentDialogComponent } from "../../components/enrollmentDialog";
import { CommonStore } from "src/app/modules/shared/stores";
import { IParticipantSummary } from "../../types";

@Component({
  selector: "app-precise-participants",
  templateUrl: "./precise-participants.component.html",
  styleUrls: ["./precise-participants.component.scss"],
})
export class PreciseParticipantsComponent implements OnInit {
  participants: any[];
  displayedColumns = [
    "_savepoint_timestamp",
    "f2a_participant_id",
    "f2a_full_name",
    "f2_guid",
  ];
  dataSource = new MatTableDataSource<IParticipantSummary>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public store: PreciseStore,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private common: CommonStore
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // run fresh sort on load
    this.dataSource.sort.sort({
      start: "desc",
      disableClear: false,
      id: "_savepoint_timestamp",
    });
  }
  /**
   * Triggered as a reaction from component when new data available from store
   * Load as a table data source.
   */
  setDatasource() {
    if (this.store.participantSummaries) {
      this.dataSource.data = this.store.participantSummaries;
    }
  }

  /**
   * Load pre-enrollment screen to verify screening records and unique ptid
   */
  async enrolParticipant() {
    // modal opens outside root so need to additionally pass theme if want to keep using
    const theme = this.common.activeTheme;
    const dialogRef = this.dialog.open(EnrollmentDialogComponent, {
      height: "300px",
      width: "400px",
      panelClass: ["dialog-bg-white", theme],
      autoFocus: true,
    });
    const res = await dialogRef.afterClosed().toPromise();
    console.log("res", res);
    switch (res.action) {
      case "addScreening":
        return this.store.screenNewParticipant({ f0_precise_id: res.data });
      case "enrol":
        return this.store.enrolParticipant(
          this.router,
          this.route,
          res.data.f2a_participant_id
        );
      case "viewExisting":
        return this.handleRowClicked(res.data);

      default:
        console.log("unhandled res", res);
        break;
    }
  }

  /**
   * Use default settings to search all data fields for matching string
   * Note, could refine with custom filter function
   * https://stackoverflow.com/questions/48506606/custom-filter-in-mat-table
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleRowClicked(row) {
    this.router.navigate([row.f2_guid], { relativeTo: this.route });
  }
}
