import { Component } from "@angular/core";
import { CommonStore } from "./stores/common.store";
import { RouterOutlet } from "@angular/router";
import * as Animations from "./animations";
import { OdkService } from "./services/odk/odk.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [Animations.routeChange],
})
export class AppComponent {
  // during local dev mode use an iframe to communicate with odk app designer
  enableODKDevIframe = environment.production;
  getRouteAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }
  constructor(public store: CommonStore, public odkService: OdkService) {}
}
