import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DyadProfileComponent } from "./dyad-profile.component";

describe("DyadProfileComponent", () => {
  let component: DyadProfileComponent;
  let fixture: ComponentFixture<DyadProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DyadProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyadProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
