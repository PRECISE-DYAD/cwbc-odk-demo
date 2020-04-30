import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
  keyframes,
  state,
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

export const flyInOut = trigger("flyInOut", [
  state("in", style({ opacity: 1 })),
  state("out", style({ opacity: 0, height: 0, position: "absolute" })),
  transition("* => *", [animate(200)]),
]);
