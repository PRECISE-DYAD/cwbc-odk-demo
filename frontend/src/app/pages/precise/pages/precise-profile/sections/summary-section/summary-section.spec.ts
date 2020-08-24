import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreciseProfileSummarySectionComponent } from "./summary-section";

describe("PreciseProfileSummarySectionComponent", () => {
  let component: PreciseProfileSummarySectionComponent;
  let fixture: ComponentFixture<PreciseProfileSummarySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreciseProfileSummarySectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseProfileSummarySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
