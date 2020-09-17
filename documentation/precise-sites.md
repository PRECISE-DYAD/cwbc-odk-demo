# Precise Sites

Some code alterations made be required depending on a specific deployment, such as a site using the app.
These variables can be populated within [frontend/src/environments](/frontend/environments), and must be
explicitly configured in [frontend/angular.json](/frontend/angular.json) and [scripts/build.ts](/scripts/build.ts)

They can be imported into a frontend `.ts` template file with an import statment, e.g.

```
import { environment } from "src/environments/environment";
const SITE = environment.SITE;
```

**Note - only ever import from the main environment file, as this is what is overwritten with specific configuration during build processes**

To use within a frontend `.html` template an additional declaration is required to make the
variable accessible from the corresponding `.ts`, e.g.

```
import { environment } from "src/environments/environment";

@Component({
  selector: "app-precise-screening",
  templateUrl: "./precise-screening.component.html",
  styleUrls: ["./precise-screening.component.scss"],
})
export class PreciseScreeningComponent implements OnInit {
  SITE = environment.SITE;
```

_Import site variable into ts file_

```
<div>Current site: {{SITE}}</div>

<div *ngIf="SITE !== 'gambia'">This will be shown to every site except gambia</div>
```

_Populate variable directly into template, or use to show/hide specific content_
