import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { PreciseStore, CommonStore, IParticipantSummary } from "src/app/stores";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

/**
 * Homepage of precise project
 */
@Component({
  selector: "app-precise-home",
  templateUrl: "./precise.component.html",
  styleUrls: ["./precise.component.scss"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreciseHomeComponent implements OnInit {
  participants: any[];
  columns = ["f2a_participant_id", "f2a_full_name", "f2_guid"];
  displayedColumns = ["f2a_participant_id", "f2a_full_name", "f2_guid"];
  dataSource = new MatTableDataSource<IParticipantSummary>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public store: PreciseStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // run fresh sort on load
    this.dataSource.sort.sort({
      start: "desc",
      disableClear: false,
      id: "f2a_participant_id",
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

  addRecord() {
    this.store.addParticipant();
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
    this.router.navigate([row.f2a_participant_id], { relativeTo: this.route });
  }
}
