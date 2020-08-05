import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciseScreeningComponent } from './precise-screening.component';

describe('PreciseScreeningComponent', () => {
  let component: PreciseScreeningComponent;
  let fixture: ComponentFixture<PreciseScreeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciseScreeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
