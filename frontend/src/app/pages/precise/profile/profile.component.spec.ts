import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreciseProfileComponent } from "./profile.component";

describe("PreciseProfileComponent", () => {
  let component: PreciseProfileComponent;
  let fixture: ComponentFixture<PreciseProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreciseProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
