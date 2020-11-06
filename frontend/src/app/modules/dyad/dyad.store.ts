import { Injectable } from "@angular/core";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/services/odk/odk.service";
import * as IPrecise from "src/app/modules/precise/";

@Injectable()
export class DyadStore {
  constructor(private odk: OdkService) {
    console.log("hello dyad store");
    // Ensure odk ready before querying - should always resolve immediately in app but not in dev mode
    this.odk.ready$
      .pipe(takeWhile((isReady) => !isReady))
      .toPromise()
      .then(() => {
        this.loadParticipants();
      });
  }
  /**
   * Load all participants availble with Precise profiles and merge with Dyad enrollment data
   */
  async loadParticipants() {
    const rows = await this.odk.getTableRows<IParticipant>(
      MAPPED_SCHEMA.profileSummary.tableId
    );
  }
}
