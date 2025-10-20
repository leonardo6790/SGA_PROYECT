package com.sga.project.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<UsuarioDto> saveUsuario(@Valid @RequestBody UsuarioDto usuarioDto) {
        UsuarioDto guardalo = us.saveUsuario(usuarioDto);
        return ResponseEntity.ok(guardalo);
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
    public ResponseEntity<UsuarioDto> actualizar(@PathVariable Integer id, @Valid @RequestBody UsuarioDto usuarioDto) {
        usuarioDto.setNumDocumento(id);
        UsuarioDto actualizar = us.updateUsuario(usuarioDto);
        return ResponseEntity.ok(actualizar);
    }
}
