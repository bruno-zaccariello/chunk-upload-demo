package br.com.zaccariello.bruno.chunkuploadmanager.service;

import br.com.zaccariello.bruno.chunkuploadmanager.config.PathConfig;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.ProcessedChunkResult;
import br.com.zaccariello.bruno.chunkuploadmanager.exceptions.FileIOException;
import br.com.zaccariello.bruno.chunkuploadmanager.shared.Messages;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

public class FileService {

    public ProcessedChunkResult appendChunk(MultipartFile chunk, String fileName) throws FileIOException  {
        try {
            File file = new File(PathConfig.getTempPath(fileName));
            Files.write(file.toPath(), chunk.getBytes(), StandardOpenOption.APPEND);
            return ProcessedChunkResult.SUCCESS;
        } catch (IOException ioException) {
            return ProcessedChunkResult.IO_ERROR;
        }
    }

    public ProcessedChunkResult createFile(MultipartFile chunk, String fileName) {
        try {
            File file = new File(PathConfig.getTempPath(fileName));
            Files.write(file.toPath(), chunk.getBytes(), StandardOpenOption.CREATE);
            return ProcessedChunkResult.SUCCESS;
        } catch (IOException ioException) {
            return ProcessedChunkResult.IO_ERROR;
        }
    }

}
