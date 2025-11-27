package com.sga.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer configurarCors(){
        return new WebMvcConfigurer() {
            @Override 
            public void addCorsMappings(@NonNull CorsRegistry registry){
                registry.addMapping("/**") // Permitir todos los endpoints
                        .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000") // Múltiples puertos
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }

            @Override
            public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                // Servir archivos estáticos desde la carpeta uploads en AppData
                String userHome = System.getProperty("user.home");
                String uploadsDir = userHome + File.separator + "AppData" + File.separator + "SGA" + File.separator + "uploads" + File.separator;
                
                // Convertir a URI válida para file://
                String uploadsUri = "file:///" + uploadsDir.replace("\\", "/");
                
                System.out.println("=== ResourceHandler Configuration ===");
                System.out.println("User home: " + userHome);
                System.out.println("Uploads dir: " + uploadsDir);
                System.out.println("Uploads URI: " + uploadsUri);
                System.out.println("=====================================");
                
                registry.addResourceHandler("/uploads/**")
                        .addResourceLocations(uploadsUri)
                        .setCachePeriod(3600);
            }
        };
    }
}
