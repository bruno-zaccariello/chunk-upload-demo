package br.com.zaccariello.bruno.chunkuploadmanager.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum ProcessedChunkResult {

    SUCCESS("Chunk processed successfully"),
    ERROR("Error processing chunk"),
    IO_ERROR("Server error while processing chunk, please try again"),
    DUPLICATED("Chunk already processed");

    private String description;
}
