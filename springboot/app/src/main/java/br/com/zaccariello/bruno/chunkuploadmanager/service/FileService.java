package br.com.zaccariello.bruno.chunkuploadmanager.service;

import br.com.zaccariello.bruno.chunkuploadmanager.config.PathConfig;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.ProcessedChunkResult;
import br.com.zaccariello.bruno.chunkuploadmanager.exceptions.FileIOException;
import br.com.zaccariello.bruno.chunkuploadmanager.shared.Messages;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

@Service
@Slf4j
public class FileService {

    public ProcessedChunkResult appendChunk(MultipartFile chunk, String fileName, Boolean isFinalChunk) {
        try {
            File file = new File(PathConfig.getTempPath(fileName));
            checkFolder(file);
            log.info("Appending chunk {} to file {} at: {}", chunk.getName(), file.getName(), file.getAbsolutePath());
            Files.write(file.toPath(), chunk.getBytes(), StandardOpenOption.APPEND);

            if (isFinalChunk) {
                createFinalFile(fileName);
            }
            return ProcessedChunkResult.SUCCESS;
        } catch (IOException ioException) {
            log.error("Error appending chunk to file: {}", ioException.getMessage());
            return ProcessedChunkResult.IO_ERROR;
        }
    }

    public ProcessedChunkResult newChunk(MultipartFile chunk, String fileName) {
        try {
            File file = new File(PathConfig.getTempPath(fileName));
            checkFolder(file);
            log.info("Creating file {} at: {}", file.getName(), file.getAbsolutePath());
            Files.write(file.toPath(), chunk.getBytes(), StandardOpenOption.CREATE);
            return ProcessedChunkResult.SUCCESS;
        } catch (IOException ioException) {
            log.error("Error creating file: {}", ioException.getMessage());
            return ProcessedChunkResult.IO_ERROR;
        }
    }

    public ProcessedChunkResult createFullFile(MultipartFile chunk, String fileName) {
        try {
            File file = new File(PathConfig.getResultPath(fileName));
            checkFolder(file);
            log.info("Creating file {} at: {}", fileName, file.getAbsolutePath());
            Files.write(file.toPath(), chunk.getBytes(), StandardOpenOption.CREATE);
            return ProcessedChunkResult.SUCCESS;
        } catch (IOException ioException) {
            log.error("Error creating file: {}", ioException.getMessage());
            return ProcessedChunkResult.IO_ERROR;
        }
    }

    private void createFinalFile(String fileName) {
        try {
            File tempFile = new File(PathConfig.getTempPath(fileName));
            File resultFile = new File(PathConfig.getResultPath(fileName));
            checkFolder(resultFile);
            log.info("Generating Final File {} at: {}", fileName, resultFile.getAbsolutePath());
            Files.copy(tempFile.toPath(), resultFile.toPath());
        } catch (IOException ioException) {
            log.error("Error creating file: {}", ioException.getMessage());
            throw new FileIOException(Messages.FileProcessing.FILE_IO_EXCEPTION);
        }
    }

    private void checkFolder(File file) {
        File parent = file.getParentFile();
        if (!parent.exists() && !parent.mkdirs()) {
            throw new FileIOException(Messages.FileProcessing.FILE_IO_EXCEPTION);
        }
    }

}
