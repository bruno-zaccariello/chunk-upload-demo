package br.com.zaccariello.bruno.chunkuploadmanager.controller;

import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadRequest;
import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ChunkUploadController {

    public ChunkUploadResponse processChunk(
            @RequestPart(value = "chunk", required = true) MultipartFile chunk,
            ChunkUploadRequest request
    ) {
        return null;
    }

}
