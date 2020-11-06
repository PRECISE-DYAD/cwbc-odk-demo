import { Component } from "@angular/core";
import { DyadService } from "../../services/dyad.service";

@Component({
  selector: "app-dyad-participants",
  templateUrl: "./dyad-participants.component.html",
  styleUrls: ["./dyad-participants.component.scss"],
})
export class DyadParticipantsComponent {
  constructor(public dyadService: DyadService) {}
}
