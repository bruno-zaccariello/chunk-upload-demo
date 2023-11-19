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
@Table(name = "tfile")
public class ChunkFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false, length = 60)
    private String fileName;

    @Column(name = "file_hash", length = 40)
    private String fileHash;

    @Column(name = "file_size")
    private Long totalFileBytes;

    @Column(name = "total_chunks", nullable = false)
    private Long totalChunks;

    @Column(name = "last_processed_chunk")
    private Long lastProcessedChunk;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private FileUploadStatus status;
}
