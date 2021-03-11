import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { takeWhile } from "rxjs/operators";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { environment } from "src/environments/environment";
import { _arrToHashmap } from "../../shared/utils";

import { DEVICE_FORM_SCHEMA, IActiveDevice } from "../models/device-form.model";

/**
 *
 */
const MAPPED_SCHEMA: typeof DEVICE_FORM_SCHEMA = {} as any;
Object.entries(DEVICE_FORM_SCHEMA).forEach(([baseId, value]) => {
  const tableId = environment.tableMapping[baseId] || baseId;
  const formId = environment.formMapping[baseId] || baseId;
  MAPPED_SCHEMA[baseId] = { ...value, tableId, formId };
});

@Injectable({ providedIn: "any" })
export class DeviceFormService {
  public activeDevice: IActiveDevice;
  private _dataLoaded$ = new BehaviorSubject(false);
  constructor(private odk: OdkService) {
    this.init();
  }

  async init() {
    await this.loadDeviceForms();
    this._dataLoaded$.next(true);
  }
  /** Promise to indicate when initial data has been loaded */
  async isReady() {
    return this._dataLoaded$.pipe(takeWhile((ready) => ready === false)).toPromise();
  }

  /** Load all device-type form entries specific to this device (adapted code from dyad service)  */
  private async loadDeviceForms() {
    await this.odk.ready$.pipe(takeWhile((isReady) => !isReady)).toPromise();
    const device_id = this.odk.getProperty("deviceid");
    const activeDevice: IActiveDevice = { device_id } as any;
    // get formasHash
    const promises = Object.entries(MAPPED_SCHEMA).map(async ([key, formMeta]) => {
      const { tableId } = formMeta;
      const rows = await this.odk.query(formMeta.tableId, "device_id = ?", [device_id]);
      const _rows = rows || [];
      // attach metadata
      activeDevice[tableId] = { _rows };
      // duplicate data to pre-mapped table id for use in lookups
      activeDevice[key] = { _rows };
    });
    await Promise.all(promises);
    this.activeDevice = activeDevice;
    console.log("activeDevice", this.activeDevice);
  }
}
