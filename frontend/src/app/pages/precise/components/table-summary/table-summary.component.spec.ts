import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreciseTableSummaryComponent } from "./table-summary.component";

describe("PreciseTableSummaryComponent", () => {
  let component: PreciseTableSummaryComponent;
  let fixture: ComponentFixture<PreciseTableSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreciseTableSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseTableSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
