import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import ALL_PROJECTS from "../data/projects.json";
import { OdkDataClass } from "./odkData.js";
// odkCommon declared globally from asset import
declare const odkCommon: any;
declare const window: Window & { odkData: any };

/**
 * This service provides a wrap around common odk methods and custom odk interactions
 */
@Injectable({
  providedIn: "root"
})
export class OdkService {
  projects: IProject[] = ALL_PROJECTS;
  activeProject = new BehaviorSubject(this.projects[0]);
  // when not running on device (non-production), use local odkData implementation
  odkData = new OdkDataClass();
  constructor(private http: HttpClient) {
    if (window.odkData) {
      this.odkData = window.odkData;
    }
  }

  setProjectByName(name: string) {
    const project = this.projects.find(p => p.name === name);
    this.activeProject.next(project);
  }

  async getFramework() {
    const framework = await this.http
      .get("../assets/odk/framework.json")
      .toPromise();
    console.log("framework", framework);
  }
}

interface IProject {
  image: string;
  name: string;
  tables?: any[];
}
