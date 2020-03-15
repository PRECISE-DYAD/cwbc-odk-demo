import { Component, HostBinding } from "@angular/core";
import { OdkService } from "./services/odk.service";
import { Router, ActivationEnd, ActivatedRouteSnapshot } from "@angular/router";
import { filter, distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @HostBinding("class") activeThemeCssClass: string;
  title = "frontend";
  routeData$ = this.router.events.pipe(
    filter(event => event instanceof ActivationEnd),
    distinctUntilChanged(),
    map((e: ActivationEnd) => this.getPageTitle(e.snapshot))
  );
  constructor(private odk: OdkService, private router: Router) {
    this.odk.activeProject.subscribe(p => {
      this.activeThemeCssClass = `${p.name.toLowerCase()}-theme`;
    });
  }
  getPageTitle(snapshot: ActivatedRouteSnapshot) {
    const title = snapshot.data.title ? snapshot.data.title : "";
    // if variables used in title replace with lookup
    return title
      .split(":")
      .map((s: string, i: number) => {
        return i % 2 === 1 ? snapshot.params[s] : s;
      })
      .join("");
  }
}
