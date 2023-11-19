import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ChunkUploadRequest, ChunkUploadResponse } from '../../models/chunk-upload.model';
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

  private lotHandler!: ServiceChunkLotHandler<ChunkUploadRequest, ChunkUploadResponse>;
  private mbPerChunk!: number;
  private lotSize!: number;
  private autoIncrement!: boolean;

  public filesHashed = false;

  public processedObserver!: Subscription;
  public totalProcessed = 0;

  public progressObserver!: Subscription;
  public progress = 0;

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
    }
  }

  hashFiles() {
    if (!this.lotHandler) {
      return;
    }
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
    if (this.progressObserver) {
      this.progressObserver.unsubscribe();
    }

    if (this.processedObserver) {
      this.processedObserver.unsubscribe();
    }

    this.processedObserver = this.lotHandler.observeProcessedFiles()
      .subscribe((totalProcessed) => {
        this.totalProcessed = totalProcessed
      });

    this.progressObserver = this.lotHandler
      .trackProgress()
      .subscribe((progess) => {
        this.progress = progess;
      });
  }

  private setHandlers() {
    this.progress = 0;
    this.totalProcessed = 0;

    if (this.files) {
      this.chunkHandlers = this.files?.map(
        (file) => new ServiceChunkHandler(file, this.sendChunk.bind(this), { mbPerChunk: this.mbPerChunk, autoIncrement: this.autoIncrement })
      );
      this.lotHandler = new ServiceChunkLotHandler(this.chunkHandlers, { lotSize: this.lotSize });
      this.setupListeners();
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
