import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChunkUploadCoreComponent } from '../chunk-upload-core/chunk-upload-core.component';
import { ChunkUploadLotComponent } from '../chunk-upload-lot/chunk-upload-lot.component';

@Component({
  selector: 'bcz-chunk-upload-home',
  standalone: true,
  imports: [CommonModule, ChunkUploadCoreComponent, ChunkUploadLotComponent],
  templateUrl: './chunk-upload-home.component.html',
  styleUrl: './chunk-upload-home.component.scss'
})
export class ChunkUploadHomeComponent {

}
