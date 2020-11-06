import { Component } from "@angular/core";
import { DyadStore } from "src/app/modules/dyad/dyad.store";

@Component({
  selector: "app-dyad-participants",
  templateUrl: "./dyad-participants.component.html",
  styleUrls: ["./dyad-participants.component.scss"],
})
export class DyadParticipantsComponent {
  constructor(public store: DyadStore) {}
}
