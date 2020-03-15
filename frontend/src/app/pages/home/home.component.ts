import { Component, OnInit } from "@angular/core";
import { OdkService } from "src/app/services/odk.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  projects = [];
  constructor(odk: OdkService) {
    this.projects = odk.projects;
  }

  ngOnInit(): void {}
}
