import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { PreciseHomeComponent } from "./pages/precise/precise.component";
import { PreciseProfileComponent } from "./pages/precise/profile/profile.component";
import { InstallComponent } from "./pages/install/install.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { title: "Select A Project" },
  },
  {
    path: "projects",
    redirectTo: "",
  },
  {
    path: "projects/precise",
    component: PreciseHomeComponent,
    data: { title: "Precise" },
  },
  {
    path: "projects/precise/:participantId",
    component: PreciseProfileComponent,
  },
  {
    path: "guides",
    redirectTo: "",
  },
  {
    path: "guides/install",
    component: InstallComponent,
    data: { title: "Installation Notes" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
