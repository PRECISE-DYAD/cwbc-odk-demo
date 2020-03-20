import { observable, action, computed } from "mobx-angular";
import { Injectable } from "@angular/core";
import ALL_PROJECTS from "../data/projects.json";
import { IProjectMeta } from "../types/types";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CommonStore {
  constructor(private http: HttpClient) {
    this.getFramework();
  }
  @observable projectMeta$: IProjectMeta;
  @observable title = "Select A Project";
  @observable projects: IProjectMeta[] = ALL_PROJECTS;
  @computed get activeTheme() {
    return this.projectMeta$
      ? `theme-${this.projectMeta$.id}`
      : "theme-default";
  }

  @observable framework: any;

  @action doSomething() {}

  @action setProjectById(id: IProjectMeta["id"]) {
    this.projectMeta$ = ALL_PROJECTS.find(p => p.id === id);
    this.title = this.projectMeta$.name;
  }

  @action async getFramework() {
    const framework = await this.http.get("../odk/framework.json").toPromise();
    this.framework = framework;
  }
}
