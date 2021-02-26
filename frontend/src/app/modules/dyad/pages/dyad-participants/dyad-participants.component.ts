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
  dataSource = new MatTableDataSource<any>();
  displayedColumns = ["d1_enroll_consent", "f2a_participant_id", "f2a_full_name", "f2_guid"];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public dyadService: DyadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.loadParticipants();
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
    const { allParticipants } = this.dyadService;
    this.dataSource.data = allParticipants.map((p, i) => this.getDatasourceData(p));
  }
  /**
   * To make it easier to search and filter store just a subset of data at the top level
   * Keep the raw participant data for use in row click handler
   */
  private getDatasourceData(participant: IDyadParticipantSummary) {
    const d1_enroll_consent = participant.dyad_consent?.d1_enroll_consent || null;
    const { f2a_participant_id, f2a_full_name, f2_guid } = participant.precise_profileSummary;
    return { d1_enroll_consent, f2a_participant_id, f2a_full_name, f2_guid, _raw: participant };
  }

  handleRowClicked(row: { _raw: IDyadParticipantSummary }) {
    // as all data for a row is merged into the top level, use _raw for processing
    const participant = row._raw;
    if (participant.dyad_consent && participant.dyad_consent.d1_enroll_consent === "1") {
      this.router.navigate([participant.precise_profileSummary.f2_guid], {
        relativeTo: this.route,
      });
    } else {
      this.dyadService.enrolParticipant(this.router, this.route, participant);
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
