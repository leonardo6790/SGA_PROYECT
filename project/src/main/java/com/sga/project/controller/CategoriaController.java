package com.sga.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.CategoriaDto;
import com.sga.project.service.CategoriaService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/cat")
public class CategoriaController {

    @Autowired
    private CategoriaService cs;

    @PostMapping("crear")
    public ResponseEntity <CategoriaDto> saveCategoria (@Valid @RequestBody CategoriaDto categoriaDto) {
        CategoriaDto guardar = cs.saveCategoria(categoriaDto);
        return ResponseEntity.ok(guardar);
    }
    
    @DeleteMapping("/borrar/{id_categoria}")
    public ResponseEntity<Void> borrar(@PathVariable Integer id_categoria){
        cs.deleteCategoria(id_categoria);
        return ResponseEntity.noContent().build();
    }
    
    }
    

