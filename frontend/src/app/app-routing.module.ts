import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ProjectComponent } from "./pages/project/project.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { breadcrumb: "", title: "Select A Project" }
  },
  {
    path: "projects/:projectId",
    component: ProjectComponent,
    data: { breadcrumb: ":projectId" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
