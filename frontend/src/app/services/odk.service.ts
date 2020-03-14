import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import ALL_PROJECTS from "../data/projects.json";
import { OdkDataClass } from "./odkData.js";
import { environment } from "../../environments/environment";
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
    if (environment.odkLibs) {
      // Import scripts
      /*
        <!-- <script type="text/javascript" src="assets/odk/odkCommon.js"></script>
    <script type="text/javascript" src="assets/odk/odkData.js"></script>
    <script
      type="text/javascript"
      src="assets/odk/tables/odkTables.js"
    ></script> -->
    */
      this.odkData = window.odkData;
    }
    this.getFramework();

    // const info = JSON.parse(odkCommon.getPlatformInfo());
    // console.log("info", info);
    // console.log("odkData", this.odkData);
    // console.log(
    //   "table ids",
    //   this.odkData.getAllTableIds(
    //     res => {
    //       console.log("all tables", res);
    //     },
    //     err => console.error(err)
    //   )
    // );
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
