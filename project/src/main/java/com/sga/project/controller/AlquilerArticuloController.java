package com.sga.project.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.service.AlquilerArticuloService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping ("/api/AlquilerArticulos")
public class AlquilerArticuloController {

    private final AlquilerArticuloService alquiArtiServi;

    public AlquilerArticuloController (AlquilerArticuloService alquiArtiServi) {
        this.alquiArtiServi = alquiArtiServi;
    }

    @PostMapping("/asignar")
    public ResponseEntity<AlquilerArticulosDto> asignar(@Valid @RequestBody AlquilerArticulosDto dto) {
        AlquilerArticulosDto asignado = alquiArtiServi.asignar(dto);
        return ResponseEntity.ok(asignado);
    }

    @GetMapping("/Alquiler/{id}")
    public ResponseEntity<List<AlquilerArticulosDto>> listarPorAlquiler(@PathVariable Integer id) {

        List<AlquilerArticulosDto> asignaciones = alquiArtiServi.listarPorAlquiler(id);

        return ResponseEntity.ok(asignaciones);
    }

    @GetMapping("/Articulo/{id}")
    public ResponseEntity<List<AlquilerArticulosDto>> listarPorArticulos (@PathVariable Integer id) {

        List<AlquilerArticulosDto> asignaciones = alquiArtiServi.listarPorArticulo(id);
        return ResponseEntity.ok(asignaciones);
    }

    @DeleteMapping("/Eliminar/{idArt}/{idAlq}")
    public ResponseEntity<Void> eliminarAsig (@PathVariable Integer idArt, Integer idAlq) {
        alquiArtiServi.eliminarAsignacion(idArt, idAlq);
        return ResponseEntity.noContent().build();
        
    }
    
    @GetMapping
    public ResponseEntity<List<AlquilerArticulosDto>> listarTodos() {
        return ResponseEntity.ok(alquiArtiServi.listarAlquileres());
    }



    }
    
    

    
    

