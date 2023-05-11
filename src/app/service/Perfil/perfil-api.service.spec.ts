import { TestBed } from '@angular/core/testing';

import { PerfilApiService } from './perfil-api.service';

describe('PerfilApiService', () => {
  let service: PerfilApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
