import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreciseProfileComponent } from './precise-profile.component';

describe('PreciseProfileComponent', () => {
  let component: PreciseProfileComponent;
  let fixture: ComponentFixture<PreciseProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciseProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
