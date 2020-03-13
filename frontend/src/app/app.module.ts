import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";

import { ProjectComponent } from "./pages/project/project.component";
import { RouterModule } from "@angular/router";
// custom components
import { ComponentsModule } from "./components/components.module";

@NgModule({
  declarations: [AppComponent, HomeComponent, ProjectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    // Custom components
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
