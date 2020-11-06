import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { IODkTableRowData } from "src/app/types/odk.types";
import { OdkService } from "src/app/services/odk/odk.service";

/**
 * Looks up a given odk table by id and returns a html table of values
 */
@Component({
  selector: "app-odk-table-rows",
  templateUrl: "./odkTableRows.html",
  styleUrls: ["./odkTableRows.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OdkTableRowsComponent implements OnInit {
  /**
   * @Input columns: specify which columns should be displayed. If left
   * blank will populate all
   * @Output rowClicked: event emitter to pass row info to parent component on click
   */
  @Input() tableId: string;
  @Input() columns: string[];
  @Output() rowClicked = new EventEmitter<IODkTableRowData>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;

  constructor(private odk: OdkService) {}
  /**
   * When initialised make relevant calls to get table row data
   */
  ngOnInit(): void {
    this._bindOdkRowData();
  }
  /**
   * When a row is clicked emit back up to parent component to handle
   */
  handleRowClicked(row: IODkTableRowData) {
    this.rowClicked.emit(row);
  }
  /**
   * Launch ODK survey to add new record for the table using default form
   */
  addRecord() {
    this.odk.addRowWithSurvey(this.tableId, this.tableId);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  /**
   * Get the table row data, bind to table and add relevant sort/pagination
   */
  private async _bindOdkRowData() {
    let rows = await this.odk.getTableRows(this.tableId);
    if (this.columns) {
      // when columns specified pre filter data to only matching column values
      // for more efficient render and filter
      rows = rows.map((r) => {
        const filteredObj: any = {};
        this.columns.forEach((v) => {
          filteredObj[v] = r[v];
        });
        return filteredObj;
      });
    } else {
      this.columns = Object.keys(rows[0]);
    }
    this.dataSource = new MatTableDataSource(rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    return rows;
  }
}
/*
[
  {
    "\"_id\"": "uuid:d82d4651-04dc-46c5-b23b-ed746ae94cdc",
    "\"_form_id\"": "profile",
    "\"_locale\"": "en_GB",
    "\"_savepoint_type\"": "COMPLETE",
    "\"_savepoint_timestamp\"": "2020-03-23T16:48:49.128000000",
    "\"_savepoint_creator\"": "anonymous",
    "\"edd\"": "13/08/2021",
    "\"fullName\"": "Jane Doe",
    "\"ga\"": "Jdhbdbzj",
    "\"phoneNum\"": "798940725",
    "\"ptid\"": "Id-001",
    "\"_default_access\"": "FULL",
    "\"_group_modify\"": "",
    "\"_group_privileged\"": "",
    "\"_group_read_only\"": "",
    "\"_row_etag\"": "",
    "\"_row_owner\"": "anonymous",
    "\"completed_visit_1\"": "TRUE"
  },
  {
    "\"_id\"": "uuid:d82d4651-04dc-46c5-b23b-ed746ae94cde",
    "\"_form_id\"": "profile",
    "\"_locale\"": "en_GB",
    "\"_savepoint_type\"": "COMPLETE",
    "\"_savepoint_timestamp\"": "2020-03-23T16:48:49.128000000",
    "\"_savepoint_creator\"": "anonymous",
    "\"edd\"": "13/08/2021",
    "\"fullName\"": "Hannah Foe",
    "\"ga\"": "assdfa",
    "\"phoneNum\"": "901342959",
    "\"ptid\"": "Id-002",
    "\"_default_access\"": "FULL",
    "\"_group_modify\"": "",
    "\"_group_privileged\"": "",
    "\"_group_read_only\"": "",
    "\"_row_etag\"": "",
    "\"_row_owner\"": "anonymous",
    "\"completed_visit_1\"": "FALSE"
  }
]

*/
