package com.sga.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.TipoDocDto;
import com.sga.project.service.TipoDocService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tipodoc")
public class TipoDocController {
    
    @Autowired
    private TipoDocService tipoDocService;
    
    @GetMapping
    public ResponseEntity<List<TipoDocDto>> listarTiposDoc() {
        List<TipoDocDto> tiposDoc = tipoDocService.getListTiposDocs();
        return ResponseEntity.ok(tiposDoc);
    }
    
    @GetMapping("consultarId/{id}")
    public ResponseEntity<TipoDocDto> obtenerTipoDoc(@PathVariable Integer id) {
        TipoDocDto tipoDoc = tipoDocService.getTipoDoc(id);
        return ResponseEntity.ok(tipoDoc);
    }
    
    @PostMapping("/crear")
    public ResponseEntity<TipoDocDto> crearTipoDoc(@Valid @RequestBody TipoDocDto tipoDocDto) {
        TipoDocDto nuevoTipoDoc = tipoDocService.saveTipoDoc(tipoDocDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTipoDoc);
    }
    
    @PutMapping("actualizar/{id}")
    public ResponseEntity<TipoDocDto> actualizarTipoDoc(
            @PathVariable Integer id,
            @Valid @RequestBody TipoDocDto tipoDocDto) {
        tipoDocDto.setIdTipoDoc(id);
        TipoDocDto tipoDocActualizado = tipoDocService.updateTipoDoc(tipoDocDto);
        return ResponseEntity.ok(tipoDocActualizado);
    }
    
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> eliminarTipoDoc(@PathVariable Integer id) {
        tipoDocService.deleteTipoDoc(id);
        return ResponseEntity.noContent().build();
    }
}
