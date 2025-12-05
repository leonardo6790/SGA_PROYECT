package com.sga.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.models.Barrio;
import com.sga.project.models.Rol;
import com.sga.project.models.TipoDoc;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.RolRepositoryes;
import com.sga.project.repositoryes.TipoDocRepositoryes;
import com.sga.project.repositoryes.UsuarioRepositoryes;

@RestController
@RequestMapping("/api/setup")
public class SetupController {

    private final UsuarioRepositoryes usuarioRepo;
    private final RolRepositoryes rolRepo;
    private final BarrioRepositoryes barrioRepo;
    private final TipoDocRepositoryes tipoDocRepo;
    private final PasswordEncoder passwordEncoder;

    public SetupController(
            UsuarioRepositoryes usuarioRepo,
            RolRepositoryes rolRepo,
            BarrioRepositoryes barrioRepo,
            TipoDocRepositoryes tipoDocRepo,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepo = usuarioRepo;
        this.rolRepo = rolRepo;
        this.barrioRepo = barrioRepo;
        this.tipoDocRepo = tipoDocRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/create-cliente")
    public ResponseEntity<String> createCliente() {
        try {
            // Verificar si ya existe
            if (usuarioRepo.findByCorreoElec("cliente@ejemplo.com").isPresent()) {
                return ResponseEntity.ok("El usuario cliente@ejemplo.com ya existe");
            }

            // Obtener rol CLIENTE
            Rol rolCliente = rolRepo.findByNomRol("CLIENTE")
                    .orElseThrow(() -> new RuntimeException("Rol CLIENTE no encontrado"));

            // Obtener primer barrio disponible
            Barrio barrio = barrioRepo.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No hay barrios disponibles"));

            // Obtener primer tipo de documento disponible
            TipoDoc tipoDoc = tipoDocRepo.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No hay tipos de documento disponibles"));

            // Crear usuario
            Usuario cliente = new Usuario();
            cliente.setNumDoc(1000000003);
            cliente.setNom1("Cliente");
            cliente.setNom2("Ejemplo");
            cliente.setApe1("Prueba");
            cliente.setApe2("Test");
            cliente.setDireccion("Carrera 10 #20-30");
            cliente.setNumTel(3201234567L);
            cliente.setCorreoElec("cliente@ejemplo.com");
            cliente.setContraseña(passwordEncoder.encode("cliente123"));
            cliente.setActivo(true);
            cliente.setBarrio(barrio);
            cliente.setTipoDoc(tipoDoc);
            cliente.setRol(rolCliente);

            usuarioRepo.save(cliente);

            return ResponseEntity.ok("Usuario cliente@ejemplo.com creado exitosamente con contraseña: cliente123");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error al crear usuario: " + e.getMessage());
        }
    }
}
