import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DyadParticipantsComponent } from "./dyad-participants.component";

describe("DyadParticipantsComponent", () => {
  let component: DyadParticipantsComponent;
  let fixture: ComponentFixture<DyadParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DyadParticipantsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DyadParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
