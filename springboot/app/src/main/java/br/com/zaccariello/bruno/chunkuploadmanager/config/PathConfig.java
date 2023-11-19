package br.com.zaccariello.bruno.chunkuploadmanager.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class PathConfig {
    static String temp;
    static String result;

    private static String changeExtension(String fileName) {
        return fileName.substring(0, fileName.lastIndexOf(".")) + ".temp";
    }

    public static String getTempPath(String fileName) {
        return temp.concat(File.separator + changeExtension(fileName));
    }

    public static String getResultPath(String fileName) {
        return result.concat(File.separator + fileName);
    }

    @Value("${output.temp}")
    public void setTemp(String temp) {
        PathConfig.temp = temp;
    }

    @Value("${output.result}")
    public void setResult(String result) {
        PathConfig.result = result;
    }
}
