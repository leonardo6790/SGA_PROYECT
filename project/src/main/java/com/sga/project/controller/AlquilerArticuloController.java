package com.sga.project.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.service.AlquilerArticuloService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;


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
    
    // Endpoint temporal para depurar
    @GetMapping("/debug/Alquiler/{id}")
    public ResponseEntity<String> debugAlquiler(@PathVariable Integer id) {
        String debug = alquiArtiServi.debugAlquiler(id);
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/Articulo/{id}")
    public ResponseEntity<List<AlquilerArticulosDto>> listarPorArticulos (@PathVariable Integer id) {

        List<AlquilerArticulosDto> asignaciones = alquiArtiServi.listarPorArticulo(id);
        return ResponseEntity.ok(asignaciones);
    }

    @DeleteMapping("/Eliminar/{idArt}/{idAlq}")
    public ResponseEntity<Void> eliminarAsig (@PathVariable Integer idArt, @PathVariable Integer idAlq) {
        alquiArtiServi.eliminarAsignacion(idArt, idAlq);
        return ResponseEntity.noContent().build();
        
    }
    
    @PutMapping("/Actualizar/{idArt}/{idAlq}")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Integer idArt, 
            @PathVariable Integer idAlq,
            @RequestBody Map<String, Boolean> body) {
        
        try {
            System.out.println("=== ACTUALIZAR ESTADO DE ARTÍCULO ===");
            System.out.println("Artículo ID: " + idArt);
            System.out.println("Alquiler ID: " + idAlq);
            System.out.println("Body recibido: " + body);
            
            Boolean estado = body.get("estado");
            Boolean entregado = body.get("entregado");
            
            System.out.println("Estado: " + estado);
            System.out.println("Entregado: " + entregado);
            
            AlquilerArticulosDto actualizado = alquiArtiServi.actualizarEstado(idArt, idAlq, estado, entregado);
            
            System.out.println("Actualización exitosa");
            return ResponseEntity.ok(actualizado);
        } catch (IllegalStateException e) {
            System.err.println("Error de validación: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        } catch (EntityNotFoundException e) {
            System.err.println("Artículo no encontrado: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Artículo no encontrado en el alquiler");
            return ResponseEntity.status(404).body(errorResponse);
        } catch (Exception e) {
            System.err.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al actualizar estado: " + e.getMessage());
            errorResponse.put("detalle", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<AlquilerArticulosDto>> listarTodos() {
        return ResponseEntity.ok(alquiArtiServi.listarAlquileres());
    }



    }
    
    

    
    

