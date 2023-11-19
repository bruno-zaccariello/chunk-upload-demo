import { Observable, Subject } from "rxjs";
import { ChunkLotHandler } from "../chunk-handler/chunk-lot-handler.model";
import { ChunkCallbackSuccess, ResponseChainReturn, ServiceChunkHandler } from "./service-chunk-handler.model";
import { roundDecimals } from "../../../../shared/utils";

export class ServiceChunkLotHandler<T, R> extends ChunkLotHandler {

    // File Data and Progress
    private _totalFiles!: number;
    private _totalProcessedFiles: number = 0;
    private _totalProcessedFilesSubject = new Subject<number>();

    private _globalProgress = 0;
    private _globalProgressSubject = new Subject<number>();
    private _handlersActive = new Map<string, number>();

    // Internal Control
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

    public trackProgress(): Observable<number> {
        return this._globalProgressSubject.asObservable();
    }

    private async sendSlice(start: number, end: number): Promise<R[][]> {
        const handlers = this.chunkHandlers.slice(start, end);
        const promises = handlers.map((handler) => handler.send(this.progressTracker.bind(this)));
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
            return nextHandler.send(this.progressTracker.bind(this))
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

    private progressTracker: ChunkCallbackSuccess<R, ServiceChunkHandler> = (r, handler) => {
        this._handlersActive.set(handler.fileName, handler.progress);
        this.calculateProgress();
    }

    private calculateProgress(): void {
        const progressArray = Array.from(this._handlersActive.values());
        const accumulatedProgress = progressArray.reduce((acc, individualProgress) => acc + individualProgress, 0);
        const globalProgress = accumulatedProgress / (this.totalFiles * 100);
        const globalProgressPercentage = globalProgress * 100;
        this._globalProgress = roundDecimals(globalProgressPercentage);
        this._globalProgressSubject.next(this._globalProgress);
    }
}