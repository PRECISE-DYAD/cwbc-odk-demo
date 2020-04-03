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
        aria-current="page"
      >
        <a [routerLink]="[breadcrumb.url]" [ngClass]="{ active: isLast }">
          {{ breadcrumb.label | titlecase }}
        </a>
      </li>
    </ol>
  `,
  styles: [
    `
      ol {
        padding-left: 1em;
      }
      li {
        display: inline;
      }
      li + li:before {
        content: " > ";
        color: black;
      }
      a {
        color: black;
        text-decoration: none;
      }
      a.active {
        text-decoration: underline;
      }
    `
  ]
})
export class BreadcrumbComponent {
  breadcrumbs$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map((event: NavigationEnd) => {
      return this.buildBreadCrumb(event.url);
    })
  );

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  buildBreadCrumb(url: string): Array<IBreadCrumb> {
    const splits = url.split("/");
    // remove first crumb from hash nav
    splits.splice(0, 1);
    const crumbs = splits.map((v, i) => {
      if (v[0] === ":") {
        v = this.activatedRoute.snapshot.params[v.replace(":", "")];
      }
      if (i === 0) {
        v = "Home";
      }
      return { label: v, url: splits.slice(0, i + 1).join("/") };
    });
    return crumbs;
  }
}
