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
  // {
  //   image: "assets/dyad.png",
  //   name: "Dyad",
  //   id: "dyad",
  // },
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
  @observable activeTheme = "theme-default";
  @action setActiveTheme(id: string) {
    this.activeTheme = id ? `theme-${id}` : "theme-default";
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
        const { title, theme } = data;
        if (title) {
          this.setPageTitle(title);
        }
        if (theme) {
          this.setActiveTheme(theme);
        }
      }
    });
  }
}
