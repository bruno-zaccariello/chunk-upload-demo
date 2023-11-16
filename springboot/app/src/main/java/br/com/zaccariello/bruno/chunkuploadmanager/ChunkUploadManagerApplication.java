package br.com.zaccariello.bruno.chunkuploadmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAutoConfiguration
public class ChunkUploadManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChunkUploadManagerApplication.class, args);
	}

}
