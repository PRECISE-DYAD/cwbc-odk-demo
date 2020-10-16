import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/services/odk/odk.service";
import { IODKTableDefQuery } from "src/app/types/odk.types";

@Component({
  selector: "app-developer-tools",
  templateUrl: "./developer-tools.component.html",
  styleUrls: ["./developer-tools.component.scss"],
})
export class DeveloperToolsComponent implements OnInit {
  tableMeta: IODKTableDefQuery[] = [];
  constructor(private odkService: OdkService, private http: HttpClient) {}

  ngOnInit(): void {
    this.odkService.ready$
      .pipe(takeWhile((isReady) => !isReady))
      .toPromise()
      .then(() => {
        this.loadData();
        this.loadTablesInit();
      });
  }
  async loadData() {
    this.tableMeta = await this.odkService.getTableMeta();
  }
  async loadTablesInit() {
    const filepath = this.odkService.getFileAsUrl(
      "config/assets/csv/tables.init"
    );
    this.http.get(filepath, { responseType: "text" }).subscribe(
      (v) => {
        const lines = v.match(/[^\r\n]+/g);
        console.log("lines", lines);
      },
      (err) => console.error(err)
    );
    console.log("filepath", filepath);
  }
}
