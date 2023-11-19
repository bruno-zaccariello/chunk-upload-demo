package br.com.zaccariello.bruno.chunkuploadmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // How would I enable any origin
        registry.addMapping("/**").allowedMethods("*");
        registry.addMapping("/**").allowedOrigins("*");
        registry.addMapping("/**").allowedOriginPatterns("*");
    }

}