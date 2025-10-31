package com.sga.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.models.TipoDoc;
import com.sga.project.repositoryes.TipoDocRepositoryes;

@RestController
@RequestMapping("/api/tipodoc")
public class TipoDocController {
    
    @Autowired
    private TipoDocRepositoryes tipoDocRepository;
    
    @GetMapping("/listar")
    public ResponseEntity<List<TipoDoc>> listarTiposDoc() {
        List<TipoDoc> tiposDoc = tipoDocRepository.findAll();
        return ResponseEntity.ok(tiposDoc);
    }
}
