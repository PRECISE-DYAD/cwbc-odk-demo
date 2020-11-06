import { Component } from "@angular/core";
import { version } from "package.json";
import { environment } from "src/environments/environment";
import { CommonStore } from "src/app/modules/shared/stores";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  APP_VERSION = version;
  enableDevTools = !environment.production;
  constructor(public store: CommonStore) {}
}
