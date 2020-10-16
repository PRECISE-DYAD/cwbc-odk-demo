import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    // note - animations change whenever the data below changes, so
    // mostly just a placeholder depending on animation specifics
    data: { title: "Select A Project", animation: "home" },
  },
  {
    path: "projects",
    redirectTo: "",
  },
  {
    path: "projects/precise",
    loadChildren: () =>
      import("./pages/precise/precise.module").then((m) => m.PreciseModule),
    data: { animation: "onLeft" },
  },
  {
    path: "developer-tools",
    loadChildren: () =>
      import("./pages/developer-tools/developer-tools.module").then(
        (m) => m.DeveloperToolsModule
      ),
    data: { animation: "onLeft" },
  },
  // {
  //   path: "guides",
  //   redirectTo: "",
  // },
  // {
  //   path: "guides/install",
  //   component: InstallComponent,
  //   data: { title: "Installation Notes" },
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
