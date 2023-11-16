import { ChunkFile } from "./chunk.model";

export class ChunkUploadResponse {
    processedChunk!: number;
    result!: string;
    fileData!: ChunkFile;
}

export class ChunkUploadRequest {
    chunkIndex!: number;
    totalChunks!: number;
    fileSize!: number;
    fileHash!: string;
    fileName!: string;
}