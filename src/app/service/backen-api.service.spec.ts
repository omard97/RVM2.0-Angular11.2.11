import { TestBed } from '@angular/core/testing';

import { BackenApiService } from './backen-api.service';

describe('BackenApiService', () => {
  let service: BackenApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackenApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
