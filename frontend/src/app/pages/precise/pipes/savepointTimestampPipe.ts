import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "savepointTimestamp",
})
/**
 * When reading from ODK savepoint field, values are saved with UTC time but timezone omitted
 * Simply append 'Z' to timestamp so when parsing aware this is UTC time
 * 2020-08-13T20:39:10.990000000 => 2020-08-13T20:39:10.990000000Z
 */
export class SavepointTimestampPipe implements PipeTransform {
  transform(value: string, ...args: any[]): any {
    return value ? value + "Z" : value;
  }
}
