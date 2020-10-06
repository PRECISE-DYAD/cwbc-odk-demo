import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

export interface IODKFormFormPopupData {
  iframeUrl: string;
}
@Component({
  selector: "odk-form-popup",
  templateUrl: "./odkFormPopup.html",
  styleUrls: ["./odkFormPopup.scss"],
})
export class ODKFormPopup {
  iframeUrl: SafeUrl;
  @ViewChild("iframe") iframeRef: ElementRef<HTMLIFrameElement>;

  constructor(
    public dialogRef: MatDialogRef<ODKFormPopup>,
    sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: IODKFormFormPopupData // as opens outside main root need to pass common store styles back
  ) {
    this.iframeUrl = sanitizer.bypassSecurityTrustResourceUrl(data.iframeUrl);
  }

  close(): void {
    this.dialogRef.close();
  }
}
