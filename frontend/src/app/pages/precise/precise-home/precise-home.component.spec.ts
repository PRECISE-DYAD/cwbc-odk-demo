import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciseHomeComponent } from './precise-home.component';

describe('PreciseHomeComponent', () => {
  let component: PreciseHomeComponent;
  let fixture: ComponentFixture<PreciseHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciseHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciseHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
