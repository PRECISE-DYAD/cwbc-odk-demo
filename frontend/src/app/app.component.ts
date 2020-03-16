import { Component, HostBinding } from "@angular/core";
import { Router, ActivationEnd, ActivatedRouteSnapshot } from "@angular/router";
import { filter, distinctUntilChanged, map } from "rxjs/operators";
import { CommonStore } from "./stores/common.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public store: CommonStore) {}
}
