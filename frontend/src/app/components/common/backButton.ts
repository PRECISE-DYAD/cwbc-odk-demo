import { Component } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-back-button",
  template: `<button
    [style.visibility]="location.path() == '' ? 'hidden' : 'visible'"
    mat-icon-button
    aria-label="Back"
    (click)="location.back()"
  >
    <mat-icon>arrow_back</mat-icon>
  </button>`,
})
export class BackButtonComponent {
  constructor(public location: Location) {}
}
