import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { ProjectComponent } from "./pages/project/project.component";
import { DetailComponent } from "./pages/detail/detail.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { breadcrumb: "", title: "Select A Project" }
  },
  {
    path: "projects",
    redirectTo: ""
  },
  {
    path: "projects/:projectId",
    component: ProjectComponent,
    data: { breadcrumb: ":projectId" }
  },
  {
    path: "projects/:projectId/:participantId",
    component: DetailComponent,
    data: { breadcrumb: ":participantId" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
