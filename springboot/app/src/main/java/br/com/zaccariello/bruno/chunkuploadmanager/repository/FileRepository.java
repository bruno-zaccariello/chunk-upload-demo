package br.com.zaccariello.bruno.chunkuploadmanager.repository;

import br.com.zaccariello.bruno.chunkuploadmanager.entity.ChunkFile;
import br.com.zaccariello.bruno.chunkuploadmanager.enums.FileUploadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<ChunkFile, Long> {
    Optional<ChunkFile> findByFileNameAndFileHash(String fileName, String fileHash);
    List<ChunkFile> findByFileNameAndFileHashAndStatusIn(String fileName, String fileHash, List<FileUploadStatus> status);
}
