package com.sga.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.CategoriaDto;
import com.sga.project.service.CategoriaService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;


@RestController
@RequestMapping("/api/cat")
public class CategoriaController {

    @Autowired
    private CategoriaService cs;

    @GetMapping
    public ResponseEntity<List<CategoriaDto>> listarCategorias() {
        List<CategoriaDto> categorias = cs.getListCategorias();
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("consultarId/{id}")
    public ResponseEntity<CategoriaDto> obtenerCategoria(@PathVariable Integer id) {
        CategoriaDto categoria = cs.getCategoria(id);
        return ResponseEntity.ok(categoria);
    }

    @PostMapping("/crear")
    public ResponseEntity<CategoriaDto> crearCategoria(@Valid @RequestBody CategoriaDto categoriaDto) {
        CategoriaDto guardar = cs.saveCategoria(categoriaDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardar);
    }
    
    @PutMapping("actualizar/{id}")
    public ResponseEntity<CategoriaDto> actualizarCategoria(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaDto categoriaDto) {
        categoriaDto.setIdCate(id);
        CategoriaDto categoriaActualizada = cs.updateCategoria(categoriaDto);
        return ResponseEntity.ok(categoriaActualizada);
    }
    
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Integer id) {
        cs.deleteCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
    

