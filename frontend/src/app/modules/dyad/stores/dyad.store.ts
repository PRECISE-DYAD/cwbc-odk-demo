import { Injectable } from "@angular/core";
import { OdkService } from "src/app/services/odk/odk.service";

@Injectable()
export class DyadStore {
  constructor(private odk: OdkService) {
    console.log("hello dyad store");
  }
}
