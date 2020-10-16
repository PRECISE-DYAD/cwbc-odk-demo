import { Component } from "@angular/core";
import { CommonStore } from "src/app/stores/common.store";
import { version } from "package.json";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  APP_VERSION = version;
  enableDevTools = location.hostname === "localhost";
  constructor(public store: CommonStore) {}
}
