import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/services/odk/odk.service";
import { IODKTableDefQuery } from "src/app/types/odk.types";
import { parseCSV } from "src/app/services/utils";

@Component({
  selector: "app-developer-tools",
  templateUrl: "./developer-tools.component.html",
  styleUrls: ["./developer-tools.component.scss"],
})
export class DeveloperToolsComponent implements OnInit {
  tableMeta: (IODKTableDefQuery & { rows: any[] })[] = [];
  tablesInitMeta: ITableInitMeta[];
  constructor(private odkService: OdkService, private http: HttpClient) {}

  ngOnInit(): void {
    this.odkService.ready$
      .pipe(takeWhile((isReady) => !isReady))
      .toPromise()
      .then(() => {
        this.init();
      });
  }
  async init() {
    this.loadODKTableMeta();
    this.processFrameworkJson();
    this.processTablesInit();
  }
  async loadODKTableMeta() {
    const meta = await this.odkService.getTableMeta();
    const promises = meta.map(async (m) => {
      let rows = [];
      try {
        rows = await this.odkService.getTableRows(m._table_id);
      } catch (err) {}
      return { ...m, rows };
    });
    this.tableMeta = await Promise.all(promises);
    console.log("tableMeta", this.tableMeta);
  }
  async openInDesigner(meta: ITableInitMeta) {
    const { tableId } = meta;
    this.odkService.addRowWithSurvey(tableId, tableId);
    this.odkService.surveyIsOpen$
      .pipe(takeWhile((isOpen) => isOpen))
      .toPromise()
      .then(() => this.loadODKTableMeta());
  }
  // NOTE - whilst it uses the application designer import methods it shouldn't be considered
  // ready for production use - there are too many issues with handling empty data and invalid data types
  async importCSV(meta: ITableInitMeta, metaIndex: number) {
    this.tablesInitMeta[metaIndex].isImporting = true;
    const csvPath = this.odkService.getFileAsUrl(meta.csvFilePath);
    const { tableId } = meta;
    this.http
      .get(csvPath, { responseType: "text" })
      .subscribe(async (csvText) => {
        const rows: any[] = await parseCSV(csvText, {
          // TODO - should be a way to pass empty strings but for now just set as NULL
          transform: (v) => (v ? v : "NULL"),
        });
        this.tablesInitMeta[metaIndex].importTotal = rows.length;
        this.tablesInitMeta[metaIndex].importProcessed = 0;
        for (const row of rows) {
          try {
            await this.odkService.addRow(tableId, row, row._id);
            this.tablesInitMeta[metaIndex].importProcessed++;
          } catch (error) {
            await this.odkService.deleteRow(tableId, row._id).then(() => {});
            break;
          }
        }
        this.loadODKTableMeta();
      });
  }
  async empty(meta: ITableInitMeta, metaIndex: number) {
    const { tableId } = meta;
    this.tablesInitMeta[metaIndex].isImporting = true;
    await this.odkService.arbitraryQuery(
      tableId,
      // `drop table if exists ${tableId}`,
      `delete from ${tableId};`,
      []
    );
    this.tablesInitMeta[metaIndex].isImporting = false;
    this.loadODKTableMeta();
  }

  /**
   *  WiP - read the main framework.json file for more table meta
   */
  private async processFrameworkJson() {
    const filepath = this.odkService.getFileAsUrl(
      "config/assets/framework/forms/framework/formDef.json"
    );
    this.http.get(filepath).subscribe(
      (formdef) => console.log("formdef", formdef),
      (err) => console.error(err)
    );
  }
  /**
   * Parse designer tables.init file and extract list of tables and filenames for preloading csv data
   * NOTE - does not handle attachments as in https://docs.odk-x.org/tables-managing/#tables-managing-config-at-startup
   */
  private async processTablesInit() {
    const filepath = this.odkService.getFileAsUrl("config/assets/tables.init");
    this.http.get(filepath, { responseType: "text" }).subscribe(
      (v) => {
        try {
          const lines = v.match(/[^\r\n]+/g);
          // process first line containing list of table keys, e.g. table_keys=Visit1,Visit2,Lab
          const tableKeys = lines[0].replace("table_keys=", "").split(",");
          const csvPaths: any = {};
          // process all filepath lines, e.g. "Visit1.filename=config/assets/csv/Visit1.csv"
          lines.slice(1).forEach((l) => {
            const [tableId, csvFilepath] = l.split(".filename=");
            csvPaths[tableId] = csvFilepath;
          });
          this.tablesInitMeta = tableKeys.map((tableId) => ({
            tableId,
            csvFilePath:
              csvPaths[tableId] || `config/assets/csv/${tableId}.csv`,
          }));
        } catch (error) {
          console.error(error);
        }
      },
      (err) => console.error(err)
    );
  }
}

interface ITableInitMeta {
  tableId: string;
  csvFilePath: string;
  isImporting?: boolean;
  importProcessed?: number;
  importTotal?: number;
}
