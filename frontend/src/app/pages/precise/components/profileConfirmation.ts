import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "precise-profile-confirmation",
  template: ` <div class="container">
    <p style="margin-top:1em; padding:5px">
      Is the information above
      <strong>accurate and up-to-date?</strong>
    </p>
    <div style="display:flex; flex-wrap:wrap;">
      <button mat-button mat-raised-button (click)="setUpToDate(false)">
        <mat-icon style="margin-right:5px">edit</mat-icon>
        <span>No, update</span>
      </button>
      <button mat-button mat-raised-button (click)="setUpToDate(true)">
        <mat-icon style="margin-right:5px">check</mat-icon>
        <span>Yes, accurate</span>
      </button>
    </div>
  </div>`,
  styles: [
    `
      .container {
        border-radius: 5px;
        display: block;
        padding: 20px;
        max-width: 400px;
        margin: 1em auto;
        border: 2px solid var(--color-black);
        color: var(--color-black);
      }
      button {
        flex: 1;
        margin: 5px;
        min-width: 180px;
      }
    `,
  ],
})
export class PreciseProfileConfirmationComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Confirmation of whether the profile is up-to-date or requires editing is passed
   * as a query param to the url for handling by parent component
   */
  setUpToDate(uptodate: boolean) {
    console.log("setting uptodate");
    this.router.navigate([], {
      queryParams: { uptodate },
      relativeTo: this.route,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }
}
