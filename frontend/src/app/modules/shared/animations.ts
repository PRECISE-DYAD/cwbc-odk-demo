import {
  trigger,
  transition,
  style,
  query,
  animate,
  state,
  sequence,
} from "@angular/animations";

export const routeChange = trigger("routeAnimations", [
  transition("* <=> *", [
    // Set a default  style for enter and leave
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          left: 0,
          width: "100%",
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    // Animate the new page in
    query(":enter", [animate("600ms ease", style({ opacity: 1 }))], {
      optional: true,
    }),
  ]),
]);

/**
 * @example <div *ngIf="showMe" @fadeEntryExit>
 */
export const fadeEntryExit = trigger("fadeEntryExit", [
  transition(":leave", [
    animate("200ms ease", style({ opacity: 0, height: 0 })),
  ]),
  transition(":enter", [
    style({ opacity: 0 }),
    animate("600ms ease", style({ opacity: 1 })),
  ]),
]);
/**
 * @example <div *ngIf="showMe" @fadeEntryExit>
 * Note - assumes starts out with translateY applied to host
 */
export const slideInOut = trigger("slideInOut", [
  state("in", style({ transform: "translateY(-100%)" })),
  state("out", style({ transform: "translateY(0)" })),
  transition(
    "in => out",
    sequence([animate("400ms ease-in-out"), style({ display: "none" })])
  ),
  transition("out => in", [animate("200ms ease-in-out")]),
]);
