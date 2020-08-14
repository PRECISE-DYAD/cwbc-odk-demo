import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import {
  PreciseStore,
  IParticipantSummary,
  IParticipantScreening,
} from "src/app/stores";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-precise-screening",
  templateUrl: "./precise-screening.component.html",
  styleUrls: ["./precise-screening.component.scss"],
})
export class PreciseScreeningComponent implements OnInit {
  participants: IParticipantScreening[];
  displayedColumns = ["f0_screen_date", "f0_woman_precise_id"];
  dataSource = new MatTableDataSource<IParticipantSummary>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public store: PreciseStore) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // run fresh sort on load
    this.dataSource.sort.sort({
      start: "desc",
      disableClear: false,
      id: "f0_screen_date",
    });
  }
  /**
   * Triggered as a reaction from component when new data available from store
   * Load as a table data source.
   */
  setDatasource() {
    if (this.store.screeningData) {
      this.dataSource.data = this.store.screeningData.filter(
        this.filterScreeningByDate
      );
    }
  }

  /**
   * Only show forms that have been screened within past 48 hours
   */
  filterScreeningByDate(v) {
    const dateCreated = new Date(v._savepoint_timestamp);
    const today = new Date();
    const diffInHours =
      (today.getTime() - dateCreated.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 48;
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

  handleRowClicked(row: IParticipantScreening) {
    console.log("row clicked", row);
    this.store.editScreening(row);
  }
}
