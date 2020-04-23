import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { IProjectMeta } from "../types/types";
const ALL_PROJECTS: IProjectMeta[] = [
  {
    image: "assets/precise.png",
    name: "Precise",
    id: "precise",
  },
];
/**
 * The CommonStore manages persisted data and operations across the entire application,
 * such as home page, app theme and page titles
 */
@Injectable()
export class CommonStore {
  constructor() {}
  @observable projectMeta$: IProjectMeta;
  @observable title = "Select A Project";
  @observable projects: IProjectMeta[] = ALL_PROJECTS;
  @computed get activeTheme() {
    return this.projectMeta$
      ? `theme-${this.projectMeta$.id}`
      : "theme-default";
  }

  @action async setProjectById(id: IProjectMeta["id"]) {
    this.projectMeta$ = ALL_PROJECTS.find((p) => p.id === id);
    this.title = this.projectMeta$.name;
  }
}

/*************************************************************************************
 * Deprected (retained simply for reference)
 * ***********************************************************************************/

/*
  @observable framework: any;

  @action async getFramework() {
    const framework = await this.http
      .get("../../assets/odk/framework.json")
      .toPromise();
    this.framework = framework;
  }
  */
