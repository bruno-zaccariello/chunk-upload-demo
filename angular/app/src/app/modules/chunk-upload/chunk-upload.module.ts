import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkUploadHomeComponent } from './components/chunk-upload-home/chunk-upload-home.component';
import { ChunkUploadRouterModule } from './chunk-upload-router.module';
import { HttpClientModule } from '@angular/common/http';
import { ChunkUploadService } from './services/chunk-upload.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ChunkUploadRouterModule,
    ChunkUploadHomeComponent,
  ],
  providers: [
    ChunkUploadService
  ]
})
export class ChunkUploadModule { }
