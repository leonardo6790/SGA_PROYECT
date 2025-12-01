package com.sga.project.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class ImageController {

    @GetMapping("/articulos/{filename:.+}")
    public ResponseEntity<byte[]> servirImagen(@PathVariable String filename) {
        try {
            String userHome = System.getProperty("user.home");
            String filePath = userHome + File.separator + "AppData" + File.separator + "SGA" + 
                            File.separator + "uploads" + File.separator + "articulos" + 
                            File.separator + filename;
            
            File file = new File(filePath);
            
            if (!file.exists()) {
                System.out.println("❌ Archivo no encontrado: " + filePath);
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("✅ Sirviendo imagen: " + filePath);
            System.out.println("   Tamaño: " + file.length() + " bytes");
            
            byte[] fileContent = Files.readAllBytes(file.toPath());
            
            // Detectar tipo de contenido basado en extensión (case insensitive)
            String filenameLower = filename.toLowerCase();
            String contentType = "image/jpeg"; // default
            
            if (filenameLower.endsWith(".jpg") || filenameLower.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (filenameLower.endsWith(".png")) {
                contentType = "image/png";
            } else if (filenameLower.endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filenameLower.endsWith(".webp")) {
                contentType = "image/webp";
            } else if (filenameLower.endsWith(".bmp")) {
                contentType = "image/bmp";
            } else if (filenameLower.endsWith(".svg")) {
                contentType = "image/svg+xml";
            }
            
            System.out.println("   Content-Type: " + contentType);
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .header("Cache-Control", "max-age=3600")
                    .body(fileContent);
                    
        } catch (IOException e) {
            System.err.println("❌ Error al leer imagen: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
