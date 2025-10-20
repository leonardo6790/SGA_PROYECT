package com.sga.project.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Clase de utilidad para generar contraseñas encriptadas con BCrypt
 * Ejecutar el método main para obtener las contraseñas encriptadas
 */
public class PasswordGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String adminPassword = "admin123";
        String vendedorPassword = "vendedor123";
        
        String adminEncrypted = encoder.encode(adminPassword);
        String vendedorEncrypted = encoder.encode(vendedorPassword);
        
        System.out.println("=== Contraseñas Encriptadas con BCrypt ===");
        System.out.println("\nADMIN (admin123):");
        System.out.println(adminEncrypted);
        System.out.println("\nVENDEDOR (vendedor123):");
        System.out.println(vendedorEncrypted);
        System.out.println("\n==========================================");
        System.out.println("Copia estas contraseñas encriptadas en el archivo SQL");
    }
}
