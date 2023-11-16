package br.com.zaccariello.bruno.chunkuploadmanager.shared;

public class Messages {

    public static class FileProcessing {
        public static final String FILE_IO_EXCEPTION = "Error while processing file";
    }

    public static class ChunkUpload {
        public static final String FILE_NOT_FOUND = "File does not exists, if you want to create a new file try again with chunk index 1";
        public static final String CHUNK_INDEX_MISMATCH = "Chunk index mismatch, check if the chunk index is in order";
        public static final String FILE_HASH_MISMATCH = "File hash mismatch, check if the file hash is correct";
        public static final String FILE_SIZE_MISMATCH = "File size mismatch, check if the file size is correct";
        public static final String FILE_CHUNKS_MISMATCH = "File chunks mismatch, check if the file chunks is correct";
    }

}
