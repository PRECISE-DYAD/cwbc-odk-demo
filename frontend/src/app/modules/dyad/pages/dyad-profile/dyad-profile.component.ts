import { Component, OnDestroy, OnInit } from "@angular/core";
import * as Animations from "src/app/animations";

@Component({
  selector: "app-dyad-profile",
  templateUrl: "./dyad-profile.component.html",
  styleUrls: ["./dyad-profile.component.scss"],
  animations: [Animations.fadeEntryExit],
})
export class DyadProfileComponent implements OnDestroy, OnInit {
  constructor() {}
  ngOnDestroy() {}
  ngOnInit() {}
}
