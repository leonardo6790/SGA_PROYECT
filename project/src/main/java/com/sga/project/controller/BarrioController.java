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

import com.sga.project.dto.BarrioDto;
import com.sga.project.service.BarrioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/barrio")
public class BarrioController {
    
    @Autowired
    private BarrioService barrioService;
    
    @GetMapping
    public ResponseEntity<List<BarrioDto>> listarBarrios() {
        List<BarrioDto> barrios = barrioService.getListBarrios();
        return ResponseEntity.ok(barrios);
    }
    
    @GetMapping("consultarId/{id}")
    public ResponseEntity<BarrioDto> obtenerBarrio(@PathVariable Integer id) {
        BarrioDto barrio = barrioService.getBarrio(id);
        return ResponseEntity.ok(barrio);
    }
    
    @PostMapping("/crear")
    public ResponseEntity<BarrioDto> crearBarrio(@Valid @RequestBody BarrioDto barrioDto) {
        BarrioDto nuevoBarrio = barrioService.saveBarrio(barrioDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoBarrio);
    }
    
    @PutMapping("actualizar/{id}")
    public ResponseEntity<BarrioDto> actualizarBarrio(
            @PathVariable Integer id,
            @Valid @RequestBody BarrioDto barrioDto) {
        barrioDto.setIdBarrio(id);
        BarrioDto barrioActualizado = barrioService.updateBarrio(barrioDto);
        return ResponseEntity.ok(barrioActualizado);
    }
    
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> eliminarBarrio(@PathVariable Integer id) {
        barrioService.deleteBarrio(id);
        return ResponseEntity.noContent().build();
    }
}
