import { Injectable } from "@angular/core";

/**
 * This service handles data sharing across components.
 * It serves as a simple drop-in for a global store
 */
@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor() {

  }

