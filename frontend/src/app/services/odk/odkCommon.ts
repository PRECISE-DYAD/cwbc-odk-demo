//tslint:disable variable-name

class OdkCommonClass {
  _listener: (e) => void;
  registerListener(listener: (e: any) => void) {
    this._listener = listener;
  }

  hasListener() {
    return this._listener !== undefined && this._listener !== null;
  }
  viewFirstQueuedAction() {
    return {} as any;
  }
  removeFirstQueuedAction() {
    return {} as any;
  }
}

export default OdkCommonClass;
