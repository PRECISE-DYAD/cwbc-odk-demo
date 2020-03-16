import { Injectable } from "@angular/core";

import { OdkDataClass } from "./odkData.js";
// odkCommon declared globally from asset import
declare const odkCommon: any;
declare const window: Window & { odkData: any };

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root"
})
export class OdkService {
  // when not running on device (non-production), use local odkData implementation
  odkData = new OdkDataClass();
  constructor() {
    if (window.odkData) {
      this.odkData = window.odkData;
    }
  }
}
