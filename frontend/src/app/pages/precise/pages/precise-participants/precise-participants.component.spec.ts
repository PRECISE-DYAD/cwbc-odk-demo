import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciseParticipantsComponent } from './precise-participants.component';

describe('PreciseParticipantsComponent', () => {
  let component: PreciseParticipantsComponent;
  let fixture: ComponentFixture<PreciseParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciseParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
