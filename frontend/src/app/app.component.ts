import { Component, HostBinding } from "@angular/core";
import { OdkService } from "./services/odk.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @HostBinding("class") activeThemeCssClass: string;
  title = "frontend";
  constructor(private odk: OdkService) {
    this.odk.activeProject.subscribe(p => {
      this.activeThemeCssClass = `${p.id}-theme`;
    });
  }
}
