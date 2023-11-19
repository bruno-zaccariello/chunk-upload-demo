import { Observable, Subject } from "rxjs";
import { ChunkLotHandler } from "../chunk-handler/chunk-lot-handler.model";
import { ChunkCallbackSuccess, ResponseChainReturn, ServiceChunkHandler } from "./service-chunk-handler.model";

export class ServiceChunkLotHandler<R> extends ChunkLotHandler<ServiceChunkHandler> {

    private _totalFiles!: number;
    private _totalProcessedFiles!: number;
    private _totalProcessedFilesSubject = new Subject<number>();

    private _parallelSendLimit = 20;
    private _parallelExecutors = new Array<ServiceChunkHandler>();
    private _currentHandlerIndex!: number;
    private _currentSlice = 0;

    private get totalSlices() {
        return Math.ceil(this.chunkHandlers.length / this._parallelSendLimit);
    }

    private get sliceStartIndex() {
        return this._currentSlice * this._parallelSendLimit;
    }

    private get sliceEndIndex() {
        let index = this.sliceStartIndex + this._parallelSendLimit;
        if (index > this.chunkHandlers.length) {
            index = this.chunkHandlers.length;
        }
        return index;
    }

    public get totalFiles() {
        return this._totalFiles;
    }

    public get totalProcessedFiles() {
        return this._totalProcessedFiles;
    }

    constructor(
        override chunkHandlers: ServiceChunkHandler[],
        private options?: {
            lotSize?: number
        }
    ) {
        super(chunkHandlers);
        this.chunkHandlers.forEach((handler) => { handler.setAutoIncrement(true); });
        Object.assign(this, options);

        this._totalFiles = chunkHandlers.length;
        this.setOptions();
    }

    public observeProcessedFiles(): Observable<number> {
        return this._totalProcessedFilesSubject.asObservable();
    }

    public sendInSlices(): Promise<R[][]> {
        return new Promise(async (resolve) => {
            let results = new Array<R[]>();
            do {
                const startIndex = this.sliceStartIndex;
                const finalIndex = this.sliceEndIndex;

                const sliceResult = await this.sendSlice(startIndex, finalIndex);
                results = results.concat(sliceResult);

                this._currentSlice++;
            } while (this._currentSlice <= this.totalSlices);
            return resolve(results);
        });
    }

    public async sendInParallel(): Promise<void> {
        const sliceIndexEnd = this.sliceEndIndex;
        this._currentHandlerIndex = this.sliceStartIndex;
        do {
            this.sendNextFile();
        } while (this._currentHandlerIndex < sliceIndexEnd)
    }

    private async sendSlice(start: number, end: number): Promise<R[][]> {
        const handlers = this.chunkHandlers.slice(start, end);
        const promises = handlers.map((handler) => handler.send());
        return Promise.allSettled(promises)
            .then(results => {
                console.log(`Inclusão do Lote ${this._currentSlice} realizado com sucesso`)
                return results
                    .filter((p) => p.status === 'fulfilled')
                    .map((p) => {
                        if (p.status === 'fulfilled') {
                            this.onFileCompleted();
                            return p.value.responseChain;
                        } else {
                            return [];
                        }
                    })
            })
    }

    private sendNextFile(): Promise<R[]> {
        if (this._currentHandlerIndex <= this.chunkHandlers.length) {
            const nextHandler = this.chunkHandlers.splice(this._currentHandlerIndex, 1)[0];
            if (!nextHandler) { return Promise.resolve([]); }
            this._parallelExecutors.push(nextHandler);
            this._currentHandlerIndex++;
            return nextHandler.send()
                .then(r => {
                    if (r.handler.isCompleted) {
                        this._parallelExecutors = this._parallelExecutors.filter((q) => !q.equals(r.handler));
                        this.onFileCompleted();
                        this.sendNextFile();
                    }
                    return r.responseChain
                });
        } else {
            this._parallelExecutors = [];
            return Promise.resolve([]);
        }
    }

    private onFileCompleted() {
        this._totalProcessedFiles++;
        this._totalProcessedFilesSubject.next(this._totalProcessedFiles);
    }

    private setOptions() {
        if (!!this.options?.lotSize && this.options.lotSize > 0) {
            this._parallelSendLimit = this.options.lotSize;
        }
    }
}