import { Component } from "@angular/core";
import { CommonStore } from "./stores/common.store";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public store: CommonStore) {}
}
