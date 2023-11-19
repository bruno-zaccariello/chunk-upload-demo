import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChunkUploadRequest, ChunkUploadResponse } from '../models/chunk-upload.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChunkUploadService {

  constructor(
    private http: HttpClient
  ) { }

  public uploadChunk(request: ChunkUploadRequest, chunk: Blob): Observable<ChunkUploadResponse> {
    const formData = new FormData();
    formData.append('chunk', chunk);
    Object.entries(request).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http.post<ChunkUploadResponse>('http://localhost:8080/chunk/upload', formData);
  }

}
