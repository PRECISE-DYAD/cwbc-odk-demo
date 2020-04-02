import { Component } from "@angular/core";
import { CommonStore } from "src/app/stores/common.store";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
  constructor(public store: CommonStore) {}
}
