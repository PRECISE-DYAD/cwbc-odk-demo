import { NgModule } from "@angular/core";

import { BoolIconPipe } from "./boolIconPipe";
import { SavepointTimestampPipe } from "./savepointTimestampPipe";

@NgModule({
  exports: [BoolIconPipe, SavepointTimestampPipe],
  declarations: [BoolIconPipe, SavepointTimestampPipe],
})
export class SharedPipesModule {}
