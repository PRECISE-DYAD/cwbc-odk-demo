import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciseComponent } from './precise.component';

describe('PreciseComponent', () => {
  let component: PreciseComponent;
  let fixture: ComponentFixture<PreciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
