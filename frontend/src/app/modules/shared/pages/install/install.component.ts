import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-install",
  templateUrl: "./install.component.html",
  styleUrls: ["./install.component.scss"],
})
export class InstallComponent implements OnInit {
  links = [
    {
      text: "ODK-X Services (v2.1.6)",
      icon: "",
      url:
        "https://github.com/odk-x/services/releases/download/2.1.6/ODK-X_Services_v2.1.6.apk",
    },
    {
      text: "ODK-X Survey (v2.1.6)",
      icon: "",
      url:
        "https://github.com/odk-x/survey/releases/download/2.1.6/ODK-X_Survey_v2.1.6.apk",
    },
    {
      text: "ODK-X Tables (v2.1.6)",
      icon: "",
      url:
        "https://github.com/odk-x/tables/releases/download/2.1.6/ODK-X_Tables_v2.1.6.apk",
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
