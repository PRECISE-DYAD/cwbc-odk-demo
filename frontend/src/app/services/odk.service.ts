import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import ALL_PROJECTS from "../data/projects.json";
// odkCommon declared globally from asset import
declare const odkCommon: any;

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root"
})
export class OdkService {
  projects: IProject[] = ALL_PROJECTS;
  activeProject = new BehaviorSubject(this.projects[0]);
  constructor() {
    const info = JSON.parse(odkCommon.getPlatformInfo());
    console.log("info", info);
  }

  setProjectByName(name: string) {
    const project = this.projects.find(p => p.name === name);
    this.activeProject.next(project);
  }
}

interface IProject {
  image: string;
  name: string;
  tables?: any[];
}
