export class ChunkFile {
    id!: number;
    fileName!: string;
    fileHash!: string;
    totalFileBytes!: number;
    totalChunks!: number;
    lastProcessedChunk!: number;
    status!: string;
}