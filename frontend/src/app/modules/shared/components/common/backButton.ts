import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-back-button",
  template: `<button
    [style.visibility]="location.path() == '' ? 'hidden' : 'visible'"
    mat-icon-button
    aria-label="Back"
    (click)="goBack()"
  >
    <mat-icon>arrow_back</mat-icon>
  </button>`,
})
export class BackButtonComponent {
  constructor(public location: Location, private router: Router, private route: ActivatedRoute) {}
  /**
   * As the back button sits outside main router and using hash routing, standard back/relative
   * routing methods won't work, so manually create the required path.
   * Note, could try use location.back() but this often contains history duplicates (e.g. reload) so not ideal
   */
  goBack() {
    // supply an optional 'previous' param to change default behaviour and supply specific url
    const previousParam = this.route.snapshot.queryParamMap.get("previous");
    if (previousParam) {
      this.router.navigateByUrl(previousParam, { replaceUrl: true });
    } else {
      const backHash = location.hash.split("/").slice(0, -1).join("/").replace("#", "");
      this.router.navigateByUrl(backHash, { replaceUrl: true });
    }
  }
}
