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
  constructor(private odkService: OdkService) {}

  ngOnInit(): void {
    this.odkService.ready$
      .pipe(takeWhile((isReady) => !isReady))
      .toPromise()
      .then(() => {
        this.loadData();
      });
  }
  async loadData() {
    this.tableMeta = await this.odkService.getTableMeta();
  }
}
