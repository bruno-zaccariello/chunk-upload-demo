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

    public ChunkUploadResponse uploadChunk(ChunkUploadRequest request) {
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

        ProcessedChunkResult result = handleNewChunk(request);
        handleIOError(file, result);

        file = updateLastProcessedChunk(result, file, request.getChunkIndex());

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

        ProcessedChunkResult result = fileService.appendChunk(
                request.getChunk(),
                request.getFileName(),
                request.isFinalChunk()
        );
        handleIOError(file, result);

        file = updateLastProcessedChunk(result, file, request.getChunkIndex());

        return new ChunkResultWithFile(result, file);
    }

    private ProcessedChunkResult handleNewChunk(ChunkUploadRequest request) {
        if (UNITY.equals(request.getTotalChunks())) {
            return fileService.createFullFile(request.getChunk(), request.getFileName());
        } else {
            return fileService.newChunk(request.getChunk(), request.getFileName());
        }
    }

    private void validateChunk(ChunkUploadRequest request, ChunkFile file) throws InvalidChunkRequest {
        Long nextChunk = UNITY;
        if (file.getLastProcessedChunk() != null) {
            nextChunk = file.getLastProcessedChunk() + UNITY;
        }

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
        file.setTotalChunks(request.getTotalChunks());
        file.setTotalFileBytes(request.getFileSize());
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

    private ChunkFile updateLastProcessedChunk(ProcessedChunkResult result, ChunkFile file, Long chunkIndex) {
        if (ProcessedChunkResult.SUCCESS.equals(result)) {
            file.setLastProcessedChunk(chunkIndex);
            return fileRepository.save(file);
        }
        return file;
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
