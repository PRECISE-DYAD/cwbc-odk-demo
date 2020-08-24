import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "boolIcon",
})

/**
 * Take boolean style input values (e.g. true/false or 0/1) and represent as icons
 */
export class BoolIconPipe implements PipeTransform {
  constructor() {}
  transform(value: any, ...args: any[]): any {
    const positives = [1, "1", true, "true", "TRUE"];
    const negatives = [0, "0", false, "false", "FASLE"];
    if (positives.includes(value)) {
      return "✔️";
    }
    if (negatives.includes(value)) {
      return "❌";
    }
    return value;
  }
}
