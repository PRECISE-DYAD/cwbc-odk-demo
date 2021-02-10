import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { IDyadParticipantSummary } from "../../models/dyad.models";
import { DyadService } from "../../services/dyad.service";

@Component({
  selector: "app-dyad-participants",
  templateUrl: "./dyad-participants.component.html",
  styleUrls: ["./dyad-participants.component.scss"],
})
export class DyadParticipantsComponent implements OnInit, AfterViewInit {
  isLoading = true;
  dataSource = new MatTableDataSource<IDyadParticipantSummary>();
  displayedColumns = ["dyad_consent", "f2a_participant_id", "f2a_full_name", "f2_guid"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public dyadService: DyadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // run fresh sort on load
    this.dataSource.sort.sort({
      start: "desc",
      disableClear: false,
      id: "dyad_consent",
    });
  }
  async loadParticipants() {
    await this.dyadService.isReady();
    this.isLoading = false;
    const { participantSummaries } = this.dyadService;
    this.dataSource.data = participantSummaries;
  }
  handleRowClicked(row: IDyadParticipantSummary) {
    if (row.dyad_consent && row.dyad_consent.d1_enroll_consent === "1") {
      this.router.navigate([row.f2_guid], { relativeTo: this.route });
    } else {
      this.dyadService.enrolParticipant(row);
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
}
