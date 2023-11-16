package br.com.zaccariello.bruno.chunkuploadmanager.service;

import br.com.zaccariello.bruno.chunkuploadmanager.entity.ChunkFile;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.FileUploadStatus;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.ProcessedChunkResult;
import br.com.zaccariello.bruno.chunkuploadmanager.exceptions.InvalidChunkRequest;
import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadRequest;
import br.com.zaccariello.bruno.chunkuploadmanager.models.ChunkUploadResponse;
import br.com.zaccariello.bruno.chunkuploadmanager.repository.FileRepository;
import br.com.zaccariello.bruno.chunkuploadmanager.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Objects;

@Service
public class ChunkUploadService {

    private class ChunkResultWithFile {
        ProcessedChunkResult status;
        ChunkFile fileData;

        public ChunkResultWithFile(ProcessedChunkResult result, ChunkFile fileData) {
            this.status = result;
            this.fileData = fileData;
        }
    }

    final Long UNITY = 1L;
    final Long INITIAL_CHUNK = UNITY;

    @Autowired
    FileRepository fileRepository;

    @Autowired
    FileService fileService;

    public ChunkUploadResponse processChunk(ChunkUploadRequest request) {
        ChunkResultWithFile chunkResult;
        if (request.getChunkIndex().equals(INITIAL_CHUNK)) {
            chunkResult = processNewFile(request);
        } else {
            chunkResult = processExistingFile(request);
        }

        return ChunkUploadResponse.builder()
                .result(chunkResult.status)
                .fileData(chunkResult.fileData)
                .processedChunk(request.getChunkIndex())
                .build();
    }

    private ChunkResultWithFile processNewFile(ChunkUploadRequest request) {
        ChunkFile file = findPendingFile(request);
        if (Objects.isNull(file)) {
            file = createFile(request);
        }

        try {
            validateChunk(request, file);
        } catch (InvalidChunkRequest invalidChunkRequest) {
            setFileStatus(file, FileUploadStatus.FAILED);
            return new ChunkResultWithFile(ProcessedChunkResult.ERROR, file);
        }

        ProcessedChunkResult result = fileService.createFile(request.getChunk(), request.getFileName());
        handleIOError(file, result);

        return new ChunkResultWithFile(result, file);
    }

    private ChunkResultWithFile processExistingFile(ChunkUploadRequest request) {
        ChunkFile file = findFile(request);

        if (Objects.isNull(file)) {
            throw new InvalidChunkRequest(Messages.ChunkUpload.FILE_NOT_FOUND);
        }

        try {
            validateChunk(request, file);
        } catch (InvalidChunkRequest invalidChunkRequest) {
            setFileStatus(file, FileUploadStatus.FAILED);

            if (request.getChunkIndex() <= file.getLastProcessedChunk()) {
                return new ChunkResultWithFile(ProcessedChunkResult.DUPLICATED, file);
            }
            return new ChunkResultWithFile(ProcessedChunkResult.ERROR, file);
        }

        ProcessedChunkResult result = fileService.appendChunk(request.getChunk(), request.getFileName());
        handleIOError(file, result);

        return new ChunkResultWithFile(result, file);
    }

    private void validateChunk(ChunkUploadRequest request, ChunkFile file) throws InvalidChunkRequest {
        Long nextChunk = file.getLastProcessedChunk() + UNITY;

        if (!request.getChunkIndex().equals(nextChunk)) {
            throw new InvalidChunkRequest(Messages.ChunkUpload.CHUNK_INDEX_MISMATCH);
        }

        if (!request.getFileHash().equals(file.getFileHash())) {
            throw new InvalidChunkRequest(Messages.ChunkUpload.FILE_HASH_MISMATCH);
        }

        if (!request.getFileSize().equals(file.getTotalFileBytes())) {
            throw new InvalidChunkRequest(Messages.ChunkUpload.FILE_SIZE_MISMATCH);
        }

        if (!request.getTotalChunks().equals(file.getTotalChunks())) {
            throw new InvalidChunkRequest(Messages.ChunkUpload.FILE_CHUNKS_MISMATCH);
        }
    }

    private void handleIOError(ChunkFile file, ProcessedChunkResult result) {
        if (ProcessedChunkResult.IO_ERROR.equals(result)) {
            setFileStatus(file, FileUploadStatus.FAILED);
        }
    }

    private ChunkFile createFile(ChunkUploadRequest request) {
        ChunkFile file = new ChunkFile();
        file.setFileName(request.getFileName());
        file.setFileHash(request.getFileHash());
        file.setStatus(FileUploadStatus.NOT_STARTED);
        return fileRepository.save(file);
    }

    private ChunkFile findPendingFile(ChunkUploadRequest request) {
        return fileRepository
                .findByFileNameAndFileHashAndStatusIn(
                        request.getFileName(),
                        request.getFileHash(),
                        Arrays.asList(FileUploadStatus.NOT_STARTED, FileUploadStatus.FAILED)
                )
                .stream().findFirst()
                .orElse(null);
    }

    private ChunkFile findFile(ChunkUploadRequest request) {
        return fileRepository
                .findByFileNameAndFileHash(request.getFileName(), request.getFileHash())
                .orElse(null);
    }

    private ChunkFile setFileStatus(ChunkFile file, FileUploadStatus status) {
        file.setStatus(status);
        return fileRepository.save(file);
    }

}
