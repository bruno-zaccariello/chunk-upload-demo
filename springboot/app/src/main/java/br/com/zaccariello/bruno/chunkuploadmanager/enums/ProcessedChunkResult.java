package br.com.zaccariello.bruno.chunkuploadmanager.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ProcessedChunkResult {

    SUCCESS("Chunk processed successfully", HttpStatus.OK),
    ERROR("Error processing chunk", HttpStatus.INTERNAL_SERVER_ERROR),
    IO_ERROR("Server error while processing chunk, please try again", HttpStatus.INTERNAL_SERVER_ERROR),
    DUPLICATED("Chunk already processed", HttpStatus.UNPROCESSABLE_ENTITY);

    private String description;
    private HttpStatus associatedStatus;
}
