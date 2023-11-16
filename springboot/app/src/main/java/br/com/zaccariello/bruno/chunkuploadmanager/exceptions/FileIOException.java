package br.com.zaccariello.bruno.chunkuploadmanager.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class FileIOException extends RuntimeException {
        public FileIOException(String message) {
            super(message);
        }

        public FileIOException(String message, Throwable cause) {
            super(message, cause);
        }
}
