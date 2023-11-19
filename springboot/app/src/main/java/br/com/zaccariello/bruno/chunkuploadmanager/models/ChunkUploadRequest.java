package br.com.zaccariello.bruno.chunkuploadmanager.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChunkUploadRequest {

    Long chunkIndex;
    Long totalChunks;
    Long fileSize;
    String fileHash;
    String fileName;

    String fileExtension;
    MultipartFile chunk;

    public boolean isFinalChunk() {
        if (chunkIndex == null) { return false; }
        return chunkIndex.equals(totalChunks);
    }

}
