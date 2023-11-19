import { TestBed } from '@angular/core/testing';

import { ChunkUploadService } from './chunk-upload.service';

describe('ChunkUploadServiceService', () => {
  let service: ChunkUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChunkUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
