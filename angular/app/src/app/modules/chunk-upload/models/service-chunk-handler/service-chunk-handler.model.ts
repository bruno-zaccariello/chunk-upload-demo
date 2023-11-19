import { Subject, firstValueFrom, take } from "rxjs";
import { ChunkHandler } from "../chunk-handler/chunk-handler.model";
import { ChunkUploadRequest } from "../chunk-upload.model";
import { Observable } from "rxjs";
import { roundDecimals } from "../../../../shared/utils";

export type ChunkCallbackSuccess<R, T extends ServiceChunkHandler> = (response: R, handler: T) => void;
export type ChunkHandlerServiceCall<R> = (handler: ServiceChunkHandler) => Observable<R>;
export type ResponseChainReturn<T, R> = { handler: ServiceChunkHandler<T, R>, responseChain: R[] };

export class ServiceChunkHandler<T = ChunkUploadRequest, R = any> extends ChunkHandler {

    private readonly INCREMENT = 1;
    private hasBeenCalled = false;
    private autoIncrement = true;
    private callback: ChunkCallbackSuccess<R, ServiceChunkHandler<T, R>> = () => { };
    private _isCompleted: boolean = false;

    private _progress: number = 0;
    private _progressSubject = new Subject<number>();

    private _responseChain = new Array<R>();
    private get responseChain(): ResponseChainReturn<T, R> {
        return { handler: this, responseChain: this._responseChain }
    }

    private get nextChunk(): number {
        return this.currentChunk + this.INCREMENT;
    }

    public get progress(): number {
        return this._progress;
    }

    public get hasNextChunk(): boolean {
        return this.nextChunk <= this._totalChunks;
    }

    public get isCompleted() {
        return this._isCompleted;
    }

    public get isAutoIncrement() {
        return this.autoIncrement;
    }

    constructor(
        file: File,
        protected callToService: ChunkHandlerServiceCall<R>,
        private options?: {
            mbPerChunk?: number,
            startingIndex?: number,
            autoIncrement?: boolean
        }
    ) {
        super(file);
        this.setOptions();
    }

    private setOptions() {
        if (typeof this.options?.autoIncrement === 'boolean') {
            this.autoIncrement = this.options.autoIncrement;
        }

        if (!!this.options?.mbPerChunk) {
            this.mbPerChunk = this.options.mbPerChunk;
            this._totalChunks = this.calculateTotalChunks();
        }

        if (!!this.options?.startingIndex) {
            this.currentChunk = this.options.startingIndex;
        }
    }

    private updateProgress(): void {
        this._progress = roundDecimals((this.currentChunk / this._totalChunks) * 100);
        this._progressSubject.next(this._progress);
    }

    public setAutoIncrement(value: boolean) {
        this.autoIncrement = value;
    }

    public getRequest<T>(): T {
        return ({
            chunkIndex: this.currentChunk,
            totalChunks: this._totalChunks,
            fileSize: this.fileSize,
            fileHash: this.hash,
            fileName: this.fileName
        } as T)
    }

    public next(callbackSuccess?: ChunkCallbackSuccess<R, ServiceChunkHandler<T, R>>): Promise<ResponseChainReturn<T, R>> {
        if (this.hasBeenCalled) {
            if (!this.hasNextChunk) {
                return Promise.resolve(this.responseChain);
            }
            this.currentChunk++;
        }
        return this.send(callbackSuccess).then((r) => r);
    };

    public async send<E = unknown>(
        callbackSuccess?: ChunkCallbackSuccess<R, ServiceChunkHandler<T, R>>,
        handleError?: (err: E) => void
    ): Promise<ResponseChainReturn<T, R>> {
        if (callbackSuccess) {
            this.callback = callbackSuccess;
        }

        if (!this.hash) {
            await this.hashFile();
        }

        if (this.currentChunk > this._totalChunks) {
            return Promise.resolve(this.responseChain);
        }

        const self = this;
        return firstValueFrom(this.callToService(self))
            .catch((err: E) => {
                handleError?.(err);
                throw err;
            })
            .then(async (result: R) => {
                this.updateProgress();
                this.hasBeenCalled = true;
                this._responseChain.push(result);

                if (!this.hasNextChunk) {
                    this._isCompleted = true;
                    this?.callback(result, this);
                    return this.responseChain;
                }

                this?.callback(result, this);
                if (!!this.autoIncrement) {
                    return this.next().then((r) => r);
                }

                return this.responseChain;
            })
    }

    public startAt(chunkIndex?: number, callbackSuccess?: ChunkCallbackSuccess<R, ServiceChunkHandler<T, R>>) {
        if (chunkIndex) {
            this.currentChunk = chunkIndex;
        }
        this.send(callbackSuccess);
    }

    public observeProgress(): Observable<number> {
        return this._progressSubject.asObservable();
    }
}