package br.com.zaccariello.bruno.chunkuploadmanager.controller;

import br.com.zaccariello.bruno.chunkuploadmanager.enums.ProcessedChunkResult;
import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadRequest;
import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadResponse;
import br.com.zaccariello.bruno.chunkuploadmanager.service.ChunkUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/chunk")
public class ChunkUploadController {

    @Autowired
    ChunkUploadService service;

    @PostMapping("/upload")
    public ResponseEntity<ChunkUploadResponse> processChunk(
            @RequestPart(value = "chunk", required = true) MultipartFile chunk,
            ChunkUploadRequest request
    ) {
        request.setChunk(chunk);
        ChunkUploadResponse result = service.uploadChunk(request);

        if (!ProcessedChunkResult.SUCCESS.equals(result.getResult())) {
            return ResponseEntity.status(result.getResult().getAssociatedStatus()).body(result);
        }

        return ResponseEntity.ok(result);
    }

}
