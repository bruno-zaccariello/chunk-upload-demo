import { Observable, take } from "rxjs";

export class ChunkHandler {

    protected readonly INITIAL_CHUNK = 1;

    protected _mbPerChunk = 1;
    protected bytesPerChunk = this.calculateBytesPerChunk();

    protected currentChunk = 1;

    protected _totalChunks!: number;
    protected fileHash!: string;

    public set mbPerChunk(value: number) {
        this._mbPerChunk = value;
        this._totalChunks = this.calculateTotalChunks();
        this.bytesPerChunk = this.calculateBytesPerChunk();
    }

    public get lastProcessedChunk(): number {
        return this.currentChunk;
    }

    public get totalChunks(): number {
        return this._totalChunks;
    }

    public get fileSize(): number {
        return this.file.size;
    }

    public get hash(): string {
        return this.fileHash;
    }

    public get fileName(): string {
        return this.file.name;
    }

    constructor(
        public file: File
    ) {
        this._totalChunks = this.calculateTotalChunks();
    }

    protected calculateTotalChunks(): number {
        return Math.ceil(this.file.size / this.bytesPerChunk);
    }

    protected calculateBytesPerChunk(): number {
        return 1024 * 1024 * this._mbPerChunk;
    }

    public equals(handler: ChunkHandler): boolean {
        return this.hash === handler?.hash &&
            this.fileName === handler?.fileName;
    }

    public async hashFile(): Promise<ChunkHandler> {
        return this.file.arrayBuffer().then((buffer) => this.getHash(buffer));
    }

    public getChunk(): Blob {
        const start = (this.currentChunk - 1) * this.bytesPerChunk;
        let end = start + this.bytesPerChunk;
        if (end > this.file.size) {
            end = this.file.size;
        }
        return this.file.slice(start, end);
    }

    protected getHash(blob: ArrayBuffer, algo = 'SHA-256'): Promise<ChunkHandler> {
        return crypto.subtle.digest('SHA-256', blob)
            .then((hash) => {
                let result = '';
                const view = new DataView(hash);
                for (let i = 0; i < hash.byteLength; i += 4) {
                    result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
                }

                this.fileHash = result;
                return this;
            });
    }

}