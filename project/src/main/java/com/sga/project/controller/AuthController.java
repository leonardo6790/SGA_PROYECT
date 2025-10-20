package com.sga.project.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.LoginRequest;
import com.sga.project.dto.LoginResponse;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.UsuarioRepositoryes;
import com.sga.project.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepositoryes usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager, 
                         JwtUtil jwtUtil,
                         UsuarioRepositoryes usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar el usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getCorreoElec(),
                            loginRequest.getContraseña()));

            // Obtener el usuario de la base de datos
            Usuario usuario = usuarioRepository.findByCorreoElec(loginRequest.getCorreoElec())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Obtener el rol (sin el prefijo ROLE_)
            String rol = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_VENDEDOR")
                    .replace("ROLE_", "");

            // Generar el token JWT
            String token = jwtUtil.generateToken(loginRequest.getCorreoElec(), rol);

            // Crear la respuesta
            LoginResponse response = new LoginResponse(
                    token,
                    usuario.getCorreoElec(),
                    rol,
                    "Login exitoso");

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, null, null, "Credenciales inválidas"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(null, null, null, "Error en el servidor: " + e.getMessage()));
        }
    }
}
