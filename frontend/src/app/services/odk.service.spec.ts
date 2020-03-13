import { TestBed } from '@angular/core/testing';

import { OdkService } from './odk.service';

describe('OdkService', () => {
  let service: OdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
