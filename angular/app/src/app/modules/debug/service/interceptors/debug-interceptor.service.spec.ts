import { TestBed } from '@angular/core/testing';

import { DebugInterceptorService } from './debug-interceptor.service';

describe('DebugInterceptorService', () => {
  let service: DebugInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebugInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
