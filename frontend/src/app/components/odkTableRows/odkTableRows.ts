import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { OdkService } from "../../services/odk/odk.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { IODkTableRowData } from "src/app/types/odk.types";

@Component({
  selector: "app-odk-table-rows",
  templateUrl: "./odkTableRows.html",
  styleUrls: ["./odkTableRows.scss"]
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
    const rows = await this.odk.getTableRows(this.tableId);
    this.columns = this.columns ? this.columns : Object.keys(rows[0]);
    this.dataSource = new MatTableDataSource(rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    return rows;
  }
}
