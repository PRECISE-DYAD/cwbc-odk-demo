import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./modules/shared/pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    // note - animations change whenever the data below changes, so
    // mostly just a placeholder depending on animation specifics
    data: { title: "Select A Project", animation: "home", theme: "default" },
  },
  {
    path: "projects",
    redirectTo: "",
  },
  {
    path: "projects/precise",
    loadChildren: () =>
      import("./modules/precise/precise.module").then((m) => m.PreciseModule),
    data: { animation: "onLeft", theme: "precise" },
  },
  {
    path: "projects/dyad",
    loadChildren: () =>
      import("./modules/dyad/dyad.module").then((m) => m.DyadModule),
    data: { animation: "onLeft", theme: "dyad" },
  },
  {
    path: "developer-tools",
    loadChildren: () =>
      import(
        "./modules/shared/pages/developer-tools/developer-tools.module"
      ).then((m) => m.DeveloperToolsModule),
    data: { animation: "onLeft" },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
