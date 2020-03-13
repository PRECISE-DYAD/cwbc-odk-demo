import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
interface IBreadCrumb {
  label: string;
  url: string;
}
@Component({
  selector: "app-breadcrumb",
  template: `
    <ol class="breadcrumb">
      <li
        *ngFor="let breadcrumb of breadcrumbs$ | async; last as isLast"
        class="breadcrumb-item"
        [ngClass]="{ active: isLast }"
        aria-current="page"
      >
        <a
          *ngIf="!isLast; else lastRoute"
          [routerLink]="[breadcrumb.url]"
          routerLinkActive="active"
        >
          {{ breadcrumb.label }}
        </a>
        <ng-template #lastRoute>{{ breadcrumb.label }}</ng-template>
      </li>
    </ol>
  `,
  styles: [
    `
      .breadcrumb li {
        display: inline;
      }
      .breadcrumb li + li:before {
        content: " > ";
        color: white;
      }
      .breadcrumb {
        background-color: #8d0000;
        padding: 20px;
        a {
          color: white;
        }
      }
    `
  ]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map(event => this.buildBreadCrumb(this.activatedRoute.root))
  );

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {}

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: Array<IBreadCrumb> = []
  ): Array<IBreadCrumb> {
    console.log("build breadcrumb", route.snapshot);
    // If no routeConfig is avalailable we are on the root path
    const label = route.routeConfig
      ? route.routeConfig.data?.breadcrumb
      : "Home";
    const path = route.routeConfig ? route.routeConfig.path : "";
    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}/`;
    const breadcrumb = {
      label,
      url: nextUrl
    };
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    console.log("new breadcrumbs", newBreadcrumbs);
    return newBreadcrumbs;
  }
}
