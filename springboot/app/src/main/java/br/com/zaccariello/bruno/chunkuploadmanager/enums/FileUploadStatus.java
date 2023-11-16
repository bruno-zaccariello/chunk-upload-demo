package br.com.zaccariello.bruno.chunkuploadmanager.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum FileUploadStatus {

    NOT_STARTED("NOT_STARTED"),
    IN_PROGRESS("Upload in progress"),
    COMPLETED("Completed"),
    FAILED("Failed");

    private String description;
}
