import { Component } from "@angular/core";
import { CommonStore } from "src/app/modules/shared/stores/common.store";
import { RouterOutlet } from "@angular/router";
import * as Animations from "src/app/modules/shared/animations";
import { OdkService } from "src/app/modules/shared/services/odk/odk.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [Animations.routeChange],
})
export class AppComponent {
  // during local dev mode use an iframe to communicate with odk app designer
  enableODKDevIframe = !environment.production;
  getRouteAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }
  constructor(public store: CommonStore, public odkService: OdkService) {}
}
