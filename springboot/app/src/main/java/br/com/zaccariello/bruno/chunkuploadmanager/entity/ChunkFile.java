package br.com.zaccariello.bruno.chunkuploadmanager.entity;

import br.com.zaccariello.bruno.chunkuploadmanager.enums.FileUploadStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TFILE", schema = "MYSCHEMA")
public class ChunkFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "FILE_NAME", nullable = false, length = 60)
    private String fileName;

    @Column(name = "FILE_HASH", length = 40)
    private String fileHash;

    @Column(name = "TOTAL_FILE_BYTES")
    private Long totalFileBytes;

    @Column(name = "TOTAL_CHUNKS", nullable = false)
    private Long totalChunks;

    @Column(name = "LAST_PROCESSED_CHUNK")
    private Long lastProcessedChunk;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20)
    private FileUploadStatus status;
}
