package br.com.zaccariello.bruno.chunkuploadmanager.models;

import br.com.zaccariello.bruno.chunkuploadmanager.entity.ChunkFile;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.ProcessedChunkResult;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
public class ChunkUploadResponse {
    Long processedChunk;
    ProcessedChunkResult result;
    ChunkFile fileData;
}
