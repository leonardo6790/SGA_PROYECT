package com.sga.project.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sga.project.dto.UsuarioDto;
import com.sga.project.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/usu")
public class UsuarioController {
    @Autowired
    private UsuarioService us;

    @PostMapping("/crear")
    public ResponseEntity<?> saveUsuario(@Valid @RequestBody UsuarioDto usuarioDto) {
        try {
            // Validar que idRol no sea nulo (es obligatorio)
            if (usuarioDto.getIdRol() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El rol (idRol) es obligatorio"));
            }
            
            // Validar que idBarrio no sea nulo (es obligatorio)
            if (usuarioDto.getIdBarrio() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El barrio (idBarrio) es obligatorio"));
            }
            
            // Validar que idTipoDoc no sea nulo (es obligatorio)
            if (usuarioDto.getIdTipoDoc() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El tipo de documento (idTipoDoc) es obligatorio"));
            }
            
            UsuarioDto guardalo = us.saveUsuario(usuarioDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardalo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear el usuario: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Integer id){
        us.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("ConsultarById/{id}")
    public ResponseEntity<UsuarioDto> buscarporid(@PathVariable Integer id){
        UsuarioDto usuarioDto = us.getUsuario(id);
        return ResponseEntity.ok(usuarioDto);
    }

    @GetMapping("/ConsultarUsuarios")
    public ResponseEntity<List<UsuarioDto>> listartodos(){
        return ResponseEntity.ok(us.getUsuarios());
    }
    
    @PutMapping("actualizar/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody UsuarioDto usuarioDto) {
        try {
            usuarioDto.setNumDocumento(id);
            UsuarioDto actualizar = us.updateUsuario(usuarioDto);
            return ResponseEntity.ok(actualizar);
        } catch (Exception e) {
            System.err.println("❌ Error al actualizar usuario: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al actualizar usuario: " + e.getMessage()));
        }
    }

    @PutMapping("activar/{id}")
    public ResponseEntity<UsuarioDto> activarUsuario(@PathVariable Integer id) {
        UsuarioDto usuarioActualizado = us.toggleActivoUsuario(id, true);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @PutMapping("desactivar/{id}")
    public ResponseEntity<UsuarioDto> desactivarUsuario(@PathVariable Integer id) {
        UsuarioDto usuarioActualizado = us.toggleActivoUsuario(id, false);
        return ResponseEntity.ok(usuarioActualizado);
    }
}
