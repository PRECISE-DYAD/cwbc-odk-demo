import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { slideInOut } from "src/app/animations";
import { OdkService } from "src/app/services/odk/odk.service";

@Component({
  selector: "odk-designer-iframe",
  animations: [slideInOut],
  template: `
    <div class="container" [@slideInOut]="show ? 'in' : 'out'">
      <mat-toolbar color="accent">
        <span>Form Preview</span>
        <span style="flex: 1;"></span>
        <button
          mat-button
          class="close-button"
          aria-label="close"
          (click)="closeIframe()"
        >
          Close
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar>
      <iframe [src]="iframeSrc" #iframe></iframe>
    </div>
  `,
  styles: [
    `
      .container {
        position: absolute;
        top: 100%;
        left: 0;
        height: 100vh;
        width: 100%;
      }
      iframe {
        flex: 1;
        width: 100%;
        height: calc(100% - 48px);
        border: none;
      }
    `,
  ],
})
/**
 *
 */
export class ODKDesignerIframeComponent {
  iframeSrc: SafeUrl;
  show = false;
  @ViewChild("iframe") iframeRef: ElementRef<HTMLIFrameElement>;
  @HostListener("window:message", ["$event"]) onPostMessage(event: any) {
    if (event.data === "odk:ready") {
      const childWindow = this.iframeRef.nativeElement.contentWindow as any;
      console.log("odk:ready", childWindow.odkData);
      if (!this.odkService.ready$.value) {
        this.odkService.setWindow(childWindow);
      }
    }
  }
  constructor(private odkService: OdkService, private sanitizer: DomSanitizer) {
    // allow child and parent to both communicate on localhost even if on different ports
    // (requires setting on child also)
    document.domain = "localhost";
    // this.setIframeSrc("http://localhost:8000/app/system/index.html");
    this.setIframeSrc(
      "http://localhost:8000/app/system/index.html?#formPath=..%2Fconfig%2Ftables%2FBirthbaby%2Fforms%2FBirthbaby%2F&screenPath=initial%2F0"
    );
    this.addWindowBindings();
  }

  addWindowBindings() {
    const w = window as any;
    w.closeAndPopPage = () => this.closeIframe();
  }
  showIframe() {
    setTimeout(() => {
      this.show = true;
    }, 50);
  }
  closeIframe() {
    setTimeout(() => {
      this.show = false;
    }, 50);
  }

  setIframeSrc(url: string) {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
