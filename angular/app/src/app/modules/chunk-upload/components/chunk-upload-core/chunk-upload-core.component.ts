import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChunkCallbackSuccess, ChunkHandlerServiceCall, ResponseChainReturn, ServiceChunkHandler } from '../../models/service-chunk-handler/service-chunk-handler.model';
import { ChunkUploadRequest, ChunkUploadResponse } from '../../models/chunk-upload.model';
import { ChunkUploadService } from '../../services/chunk-upload.service';
import { ServiceChunkLotHandler as ServiceChunkLotHandler } from '../../models/service-chunk-handler/service-chunk-lot-handler.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bcz-chunk-upload-core',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chunk-upload-core.component.html',
  styleUrl: './chunk-upload-core.component.scss'
})
export class ChunkUploadCoreComponent {

  protected files!: File[] | null;

  private mbPerChunk!: number;
  public handler!: ServiceChunkHandler;
  public autoIncrement!: boolean;

  public fileHashed = false;

  public lastProcessedChunk = 0;
  public totalChunks = 0;

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
      this.setHandler();
    }
  }

  hashFiles() {
    this.handler.hashFile()
      .then((handler) => {
        this.fileHashed = true;
      });
  }

  sendFilesManual() {
    this.handler.setAutoIncrement(false);
    return this.handler.next(this.successCallback()).then((result) => {
      result.responseChain.forEach((response) => {
        console.log(response);
      })
    });
  }

  sendFilesAutomatic() {
    this.handler.setAutoIncrement(true);
    return this.handler.send(this.successCallback())
      .then((result) => {
        result.responseChain.forEach((response) => {
          console.log(response);
        })
      })
  }

  handleMbPerChunkChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.valueAsNumber;
    if (!!value && !isNaN(value)) {
      this.mbPerChunk = value;
      this.setHandler();
    }
  }

  handleAutoSendChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.autoIncrement = target.checked;
    this.setHandler();
  }

  private successCallback(): ChunkCallbackSuccess<ChunkUploadResponse, ServiceChunkHandler> {
    return (result, handler) => {
      this.lastProcessedChunk = handler.lastProcessedChunk;
    }
  }

  private setHandler() {
    if (this.files) {
      this.handler = new ServiceChunkHandler(
        this.files[0],
        this.sendChunk.bind(this),
        { mbPerChunk: this.mbPerChunk, autoIncrement: this.autoIncrement }
      );
      this.totalChunks = this.handler.totalChunks;
      this.lastProcessedChunk = this.handler.lastProcessedChunk;
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
