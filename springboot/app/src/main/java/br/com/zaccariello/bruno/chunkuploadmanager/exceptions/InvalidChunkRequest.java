package br.com.zaccariello.bruno.chunkuploadmanager.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class InvalidChunkRequest extends RuntimeException {
        public InvalidChunkRequest(String message) {
            super(message);
        }
}
