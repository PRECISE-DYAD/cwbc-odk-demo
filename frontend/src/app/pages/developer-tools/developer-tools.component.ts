import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/services/odk/odk.service";
import { IFormDef, IFormDefSpecificationChoice } from "src/app/types/odk.types";
import { parseCSV } from "src/app/services/utils";
import { _arrToHashmap } from "src/app/utils";

@Component({
  selector: "app-developer-tools",
  templateUrl: "./developer-tools.component.html",
  styleUrls: ["./developer-tools.component.scss"],
})
export class DeveloperToolsComponent implements OnInit {
  tablesMeta: ITableMeta[];
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
    const tablesWithNames = await this.extractTableListFromFrameworkJson();
    const tablesInitCsvPaths = await this.extractTablesInitData();
    const tablesWithCSVPaths = tablesWithNames.map((t) => ({
      ...t,
      csvFilePath: tablesInitCsvPaths[t.tableId],
      rows: [],
    }));
    const tablesWithCSVData = await this.getCSVRows(tablesWithCSVPaths);
    // populate rows as empty and update later
    const tablesWithRows: ITableMeta[] = tablesWithCSVData.map((t) => ({
      ...t,
      rows: [],
    }));
    this.tablesMeta = tablesWithRows.map((t) => ({ ...t, rows: [] }));
    this.loadLocalTableRows();
  }
  /**
   * Run a request to get the current metadata for all tables, including total row count
   */
  async loadLocalTableRows() {
    const getRowOperations = this.tablesMeta.map(async (table) => {
      let rows = [];
      try {
        rows = await this.odkService.getTableRows(table.tableId);
      } catch (err) {}
      return { ...table, rows };
    });
    this.tablesMeta = await Promise.all(getRowOperations);
  }
  /**
   *
   */
  async openInDesigner(meta: ITableMeta) {
    const { tableId } = meta;
    this.odkService.addRowWithSurvey(tableId, tableId);
    this.odkService.surveyIsOpen$
      .pipe(takeWhile((isOpen) => isOpen))
      .toPromise()
      .then(() => this.loadLocalTableRows());
  }
  /**
   * Load csv files as defined in tables.init and populate raw json to table meta
   */
  async getCSVRows(tables: ITableMeta[]) {
    const promises = tables.map(async (meta) => {
      let csvRows = [];
      if (meta.csvFilePath) {
        try {
          const csvPath = this.odkService.getFileAsUrl(meta.csvFilePath);
          const csvText = await this.http
            .get(csvPath, { responseType: "text" })
            .toPromise();
          csvRows = await parseCSV(csvText, {
            // TODO - should be a way to pass empty strings but for now just set as NULL
            transform: (v) => (v ? v : "NULL"),
          });
        } catch (error) {}
      }

      return { ...meta, csvRows };
    });
    const tablesWithCSVRows = await Promise.all(promises);
    return tablesWithCSVRows;
  }

  // NOTE - whilst it uses the application designer import methods it shouldn't be considered
  // ready for production use - there are too many issues with handling empty data and invalid data types
  async importCSV(meta: ITableMeta, metaIndex: number) {
    this.tablesMeta[metaIndex].isImporting = true;
    const { tableId, csvFilePath } = meta;
    // TODO - handle checking data consistency before import (all columns defined)
    const definitions = await this.getTableDefinitions(tableId);
    const definitionsByKey = _arrToHashmap<ITableDefinitionRow>(
      definitions,
      "_element_key"
    );
    const csvPath = this.odkService.getFileAsUrl(csvFilePath);
    const csvText = await this.http
      .get(csvPath, { responseType: "text" })
      .toPromise();
    const rows: any[] = await parseCSV(csvText, {
      transform: (value, key) => {
        // TODO - should be a way to pass empty strings but for now just set as NULL
        if (value === "") {
          return null;
        }
        // Optional - handle any specific data field mapping
        // (all string values should be handled by odk function toDatabaseFromOdkDataInterfaceElementType)
        const dataType = definitionsByKey[key]?._element_type;
        switch (dataType) {
          default:
            return value;
        }
      },
    });
    this.tablesMeta[metaIndex].importProcessed = 0;
    for (const row of rows) {
      try {
        await this.odkService.addRow(tableId, row, row._id);
        this.tablesMeta[metaIndex].importProcessed++;
      } catch (error) {
        await this.odkService.deleteRow(tableId, row._id).then(() => {});
        break;
      }
    }
    this.loadLocalTableRows();
  }
  /**
   * Delete all rows in a table
   * Note - this does not delete the table itself for cases like updated definitions
   * For this the Purge method of ODK designer is required
   */
  async empty(meta: ITableMeta, metaIndex: number) {
    const { tableId } = meta;
    this.tablesMeta[metaIndex].isImporting = true;
    await this.odkService.arbitraryQuery(
      tableId,
      // `drop table if exists ${tableId}`,
      `delete from ${tableId};`,
      []
    );
    this.tablesMeta[metaIndex].isImporting = false;
    this.loadLocalTableRows();
  }
  /**
   * Return a json-parsed representation of a table's definitions.csv file
   */
  private async getTableDefinitions(tableId: string) {
    const definitionsBase = `config/tables/${tableId}/definition.csv`;
    const definitionsPath = this.odkService.getFileAsUrl(definitionsBase);
    const definitionsText = await this.http
      .get(definitionsPath, { responseType: "text" })
      .toPromise();
    const definitions = await parseCSV(definitionsText);
    return definitions as ITableDefinitionRow[];
  }

  /**
   * Read the main framework.json file to generate a list of table ids
   * and display names
   */
  private async extractTableListFromFrameworkJson() {
    const filepath = this.odkService.getFileAsUrl(
      "config/assets/framework/forms/framework/formDef.json"
    );
    const formdef = await this.http.get<IFormDef>(filepath).toPromise();
    // generate a list of choices with their display names (table ids are included in choice list)
    const choicesHash: {
      [data_value: string]: IFormDefSpecificationChoice;
    } = {};
    Object.values(formdef.specification.choices).forEach((choiceValues) => {
      choiceValues.forEach((v) => (choicesHash[v.data_value] = v));
    });
    // assume tables are defined in formdef survey sheet
    // extract list of all entries and me
    const tablesWithDisplayNames = formdef.xlsx.survey
      .filter((r) => r.hasOwnProperty("branch_label"))
      .map((r) => ({
        tableId: r.branch_label,
        display: choicesHash[r.branch_label].display,
      }));
    return tablesWithDisplayNames;
  }
  /**
   * Parse designer tables.init file and extract list of tables and filenames for preloading csv data
   * NOTE - does not handle attachments as in https://docs.odk-x.org/tables-managing/#tables-managing-config-at-startup
   */
  private async extractTablesInitData() {
    const path = this.odkService.getFileAsUrl("config/assets/tables.init");
    try {
      const v = await this.http.get(path, { responseType: "text" }).toPromise();
      const lines = v.match(/[^\r\n]+/g);
      // process first line containing list of table keys, e.g. table_keys=Visit1,Visit2,Lab
      const tableKeys = lines[0].replace("table_keys=", "").split(",");
      const csvPaths: any = {};
      // process all filepath lines, e.g. "Visit1.filename=config/assets/csv/Visit1.csv"
      lines.slice(1).forEach((l) => {
        const [tableId, csvFilepath] = l.split(".filename=");
        csvPaths[tableId] = csvFilepath;
      });
      // generate final list, assuming that tableIds without specific filename will use default path
      const csvPathsByTable: { [tableId: string]: string } = {};
      tableKeys.forEach((tableId) => {
        csvPathsByTable[tableId] =
          csvPaths[tableId] || `config/assets/csv/${tableId}.csv`;
      });
      return csvPathsByTable;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

interface ITableMeta {
  tableId: string;
  display: { title: { text: string } };
  rows: any[];
  csvFilePath?: string;
  csvRows?: any[];
  isImporting?: boolean;
  importProcessed?: number;
}

interface ITableDefinitionRow {
  _element_key: string;
  _element_name: string;
  _element_type: string;
  _list_child_element_keys: string;
}
