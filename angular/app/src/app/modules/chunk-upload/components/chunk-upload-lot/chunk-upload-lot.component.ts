import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ChunkUploadResponse } from '../../models/chunk-upload.model';
import { ServiceChunkHandler, ChunkHandlerServiceCall } from '../../models/service-chunk-handler/service-chunk-handler.model';
import { ServiceChunkLotHandler } from '../../models/service-chunk-handler/service-chunk-lot-handler.model';
import { ChunkUploadService } from '../../services/chunk-upload.service';

@Component({
  selector: 'bcz-chunk-upload-lot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chunk-upload-lot.component.html',
  styleUrl: './chunk-upload-lot.component.scss'
})
export class ChunkUploadLotComponent {

  protected files!: File[] | null;

  private lotHandler!: ServiceChunkLotHandler<ChunkUploadResponse>;
  private mbPerChunk!: number;
  private lotSize!: number;
  private autoIncrement!: boolean;

  private listenersFinalize = new Subject<void>();

  public filesHashed = false;

  public totalProcessed = 0;

  constructor(
    private chunkUploadService: ChunkUploadService
  ) { }

  public chunkHandlers!: ServiceChunkHandler[];

  handleFileChange(ev: Event) {
    const element = (ev.currentTarget as HTMLInputElement);
    const fileList: FileList | null = element.files;
    if (fileList) {
      const files = this.fileListToArray(fileList);
      this.files = files;
      this.setHandlers();
      this.setupListeners();
    }
  }

  hashFiles() {
    this.lotHandler.hashFiles()
      .then((handlers) => {
        this.filesHashed = true;
      });
  }

  sendFilesInSlices() {
    this.lotHandler.sendInSlices()
      .then(() => { })
  }

  sendFilesInParallel() {
    this.lotHandler.sendInParallel()
      .then(() => { })
  }

  handleTamanhoLoteChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.valueAsNumber;
    if (!!value && !isNaN(value)) {
      this.lotSize = value;
      this.setHandlers();
    }
  }

  handleMbPerChunkChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.valueAsNumber;
    if (!!value && !isNaN(value)) {
      this.mbPerChunk = value;
      this.setHandlers();
    }
  }

  handleAutoSendChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.autoIncrement = target.checked;
    this.setHandlers();
  }

  private setupListeners() {
    this.listenersFinalize.next();
    this.lotHandler.observeProcessedFiles()
      .pipe(takeUntil(this.listenersFinalize))
      .subscribe((totalProcessed) => {
        this.totalProcessed = totalProcessed
      });
  }

  private setHandlers() {
    if (this.files) {
      this.chunkHandlers = this.files?.map(
        (file) => new ServiceChunkHandler(file, this.sendChunk.bind(this), { mbPerChunk: this.mbPerChunk, autoIncrement: this.autoIncrement })
      );
      this.lotHandler = new ServiceChunkLotHandler(this.chunkHandlers, { lotSize: this.lotSize });
    }
  }

  private sendChunk: ChunkHandlerServiceCall<ChunkUploadResponse> = (handler: ServiceChunkHandler) => {
    return this.chunkUploadService.uploadChunk(handler.getRequest(), handler.getChunk());
  }

  private fileListToArray(fileList: FileList): File[] {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList.item(i) as File);
    }
    return files;
  }

}
