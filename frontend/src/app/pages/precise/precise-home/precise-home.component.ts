import { Component, OnInit } from "@angular/core";
import { PreciseStore } from "src/app/stores";

@Component({
  selector: "app-precise-home",
  templateUrl: "./precise-home.component.html",
  styleUrls: ["./precise-home.component.scss"],
})
export class PreciseHomeComponent {
  constructor(public store: PreciseStore) {}
}
