import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { PreciseHomeComponent } from "./pages/precise/precise.component";
import { PreciseProfileComponent } from "./pages/precise/profile/profile.component";

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
    path: "projects/precise",
    component: PreciseHomeComponent,
    data: { breadcrumb: "precise" }
  },
  {
    path: "projects/precise/:participantId",
    component: PreciseProfileComponent,
    data: { breadcrumb: ":participantId" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
