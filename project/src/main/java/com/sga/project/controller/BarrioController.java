package com.sga.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.models.Barrio;
import com.sga.project.repositoryes.BarrioRepositoryes;

@RestController
@RequestMapping("/api/barrio")
public class BarrioController {
    
    @Autowired
    private BarrioRepositoryes barrioRepository;
    
    @GetMapping("/listar")
    public ResponseEntity<List<Barrio>> listarBarrios() {
        List<Barrio> barrios = barrioRepository.findAll();
        return ResponseEntity.ok(barrios);
    }
}
