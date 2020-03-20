import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { OdkService } from "../../services/odk/odk.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-odk-table-rows",
  templateUrl: "./odkTableRows.html",
  styleUrls: ["./odkTableRows.scss"]
})
export class OdkTableRowsComponent implements OnInit {
  @Input() tableId: string;
  /**
   * specify which columns should be displayed. If left
   * blank will populate all
   */
  @Input() columns: string[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<any>;

  constructor(private odk: OdkService) {}
  ngOnInit(): void {
    this._bindOdkRowData();
  }
  rowSelected(row) {
    console.log("row selected", row);
  }
  addRecord() {
    this.odk.addRowWithSurvey("exampleTable", "exampleTable");
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
    console.log("dataSource", this.dataSource);
    console.log("columns", this.columns);

    return rows;
  }
}
