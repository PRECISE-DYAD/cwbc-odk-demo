import { Component, ViewChild, ElementRef, HostListener, NgZone } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { slideInOut } from "src/app/modules/shared/animations";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { NotificationService } from "src/app/modules/shared/services";

@Component({
  selector: "odk-designer-iframe",
  animations: [slideInOut],
  template: `
    <div class="container" [@slideInOut]="animationState">
      <mat-toolbar color="accent">
        <span>Form Preview</span>
        <span style="flex: 1;"></span>
        <button mat-button class="close-button" aria-label="close" (click)="closeIframe()">
          Close
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar>
      <iframe
        *ngIf="iframeSrc"
        [src]="iframeSrc"
        #iframe
        name="screen"
        id="previewscreen"
        class="resizeablescreen"
      ></iframe>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .container {
        position: absolute;
        left: 0;
        bottom: -100vh;
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
  iframeUri: string;
  animationState: "in" | "out" = "out";
  @ViewChild("iframe") iframeRef: ElementRef<HTMLIFrameElement>;
  @HostListener("window:message", ["$event"]) onPostMessage(event: any) {
    if (event.origin === "http://localhost:8000") {
      if (event.data && typeof event.data === "string") {
        const msg = event.data as string;
        if (msg === "odk:ready") {
          const childWindow = this.iframeRef.nativeElement.contentWindow as any;
          if (!this.odkService.ready$.value) {
            console.log("odk ready");
            this.odkService.setWindow(childWindow);
          }
        }
        if (msg.startsWith("odk:error")) {
          console.warn(msg);
          // ignore some specific errors
          if (msg.includes("Cannot read property 'promptPath' of null")) {
            return;
          }
          if (
            msg.includes(
              "odk:error - insertNewKeyValueMapDataTableStmt: changes contains unrecognized database"
            )
          ) {
            return;
          }
          // otherwise show error notification
          this.notifications.handleError(event.data);
        } else {
          console.log("odk event", event);
        }
      } else {
        console.log("odk event", event);
      }
    }
  }

  constructor(
    private odkService: OdkService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private notifications: NotificationService
  ) {
    // allow child and parent to both communicate on localhost even if on different ports
    // (requires setting on child also)
    document.domain = "localhost";
    this.setIframeSrc("http://localhost:8000/app/system/index.html?");
    this.addWindowBindings();
  }

  /**
   * These intercept commands typically sent to the designer main app, used to control iframe display
   */
  addWindowBindings() {
    const w = window as any;
    w.closeAndPopPage = (...data: any) => {
      console.log("closing page", data);
      this.closeIframe();
    };
    // e.g1. http://localhost:8000/app/system/index.html#instanceId=uuid%3A15e866cf-4847-46cf-941e-414e256953f6
    // e.g2. http://localhost:8000/app/system/index.html?#formPath=..%2Fconfig%2Ftables%2Fscreening%2Fforms%2Fscreening%2F&screenPath=initial%2F0
    // e.g3. http://localhost:8000/app/system/index.html?#formPath=..%2Fconfig%2Ftables%2FBirthbaby%2Fforms%2FBirthbaby%2F&screenPath=initial%2F0
    w.pushPageAndOpen = (urlRef: string) => {
      console.log("push page and open", urlRef);
      const instanceId = urlRef.split("#instanceId=")[1];
      const { tableId, formId } = this.odkService.activeArgs;
      const baseUrl = "http://localhost:8000/app/system/index.html";
      const formPath = encodeURIComponent(`../config/tables/${tableId}/forms/${formId}/`);
      let uri = `${baseUrl}?#formPath=${formPath}&instanceId=${instanceId}`;
      // TODO - figure out how to know which screen should be initial
      // const screenpath = encodeURIComponent(`initial/2`);
      const screenpath = null;
      if (screenpath) {
        uri += `&screenPath=${screenpath}`;
      }
      if (uri !== this.iframeUri) {
        console.log("uri", uri);
        this.iframeUri = uri;
        this.setIframeSrc(uri, true);
        this.showIframe();
      }
    };
  }
  /**
   * Window callback methods are run in a zone for change detection
   * Additional timeout included just to allow time for other ops to complete
   */
  showIframe() {
    this.ngZone.run(() => {
      console.log("showing iframe");
      setTimeout(() => {
        this.animationState = "in";
      }, 50);
    });
  }
  closeIframe() {
    if (this.animationState === "out") {
      // hasn't closed correctly, retry toggle
      this.showIframe();
      setTimeout(() => {
        this.closeIframe();
      }, 250);
    } else {
      this.ngZone.run(() => {
        console.log("closing iframe");
        setTimeout(() => {
          this.animationState = "out";
          this.iframeUri = null;
          this.odkService.surveyIsOpen$.next(false);
          setTimeout(() => {
            // Do a full page refresh as occurs in odk tables to prompt any init logic
            location.reload();
          }, 500);
        }, 50);
      });
    }
  }

  /**
   * Set the src uri for the iframe element
   * @param reload - ODK does a lot of configuration on first load, so if navigation up till now hasn't
   * been done within designer a hard reload should still configure correctly
   */
  setIframeSrc(uri: string, reload = false) {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(uri);
    if (reload) {
      const childWindow = this.iframeRef.nativeElement.contentWindow as Window;
      setTimeout(() => {
        childWindow.location.reload();
      }, 100);
    }
  }

  handleIframeError(e) {
    console.log("iframe error", e);
  }
}
