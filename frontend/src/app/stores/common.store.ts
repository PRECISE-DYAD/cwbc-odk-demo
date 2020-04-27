import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import { IProjectMeta } from "../types/types";
import { Router, ChildActivationEnd } from "@angular/router";
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
  constructor(router: Router) {
    this._subscribeToRouteChanges(router);
  }
  @observable projectMeta$: IProjectMeta;
  @observable title = "";
  @observable projects: IProjectMeta[] = ALL_PROJECTS;
  @computed get activeTheme() {
    return this.projectMeta$
      ? `theme-${this.projectMeta$.id}`
      : "theme-default";
  }

  @action async setProjectById(id: IProjectMeta["id"]) {
    this.projectMeta$ = ALL_PROJECTS.find((p) => p.id === id);
    this.setPageTitle(this.projectMeta$.name);
  }
  @action setPageTitle(title: string) {
    this.title = title;
  }

  private _subscribeToRouteChanges(router: Router) {
    router.events.subscribe((e) => {
      if (e instanceof ChildActivationEnd) {
        const { data } = e.snapshot.firstChild;
        if (data.title) {
          this.setPageTitle(data.title);
        }
      }
    });
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
