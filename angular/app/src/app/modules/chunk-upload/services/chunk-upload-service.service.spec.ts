import { TestBed } from '@angular/core/testing';

import { ChunkUploadServiceService } from './chunk-upload-service.service';

describe('ChunkUploadServiceService', () => {
  let service: ChunkUploadServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChunkUploadServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
