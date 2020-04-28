import { Component } from "@angular/core";
import { CommonStore } from "./stores/common.store";
import { RouterOutlet } from "@angular/router";
import * as Animations from "./animations";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [Animations.routeChange],
})
export class AppComponent {
  getRouteAnimation(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }
  constructor(public store: CommonStore) {}
}
