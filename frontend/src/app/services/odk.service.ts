import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import ALL_PROJECTS from "../data/projects.json";
// odkCommon declared globally from asset import
declare const odkCommon: any;

@Injectable({
  providedIn: "root"
})
export class OdkService {
  projects: IProject[] = ALL_PROJECTS;
  activeProject = new BehaviorSubject(this.projects[0]);
  constructor() {
    console.log("hello odk service", ALL_PROJECTS);
    const info = JSON.parse(odkCommon.getPlatformInfo());
    console.log("info", info);
  }

  setProjectById(id: string) {
    const project = this.projects.find(p => p.id === id);
    this.activeProject.next(project);
  }
}

interface IProject {
  image: string;
  id: string;
  title: string;
  tables?: any[];
}
