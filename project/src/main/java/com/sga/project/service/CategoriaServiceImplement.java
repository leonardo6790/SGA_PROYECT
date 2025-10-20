package com.sga.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sga.project.dto.CategoriaDto;
import com.sga.project.mapper.CategoriaMapper;
import com.sga.project.models.Categoria;
import com.sga.project.repositoryes.CategoriaRepositoryes;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service

public class CategoriaServiceImplement implements CategoriaService {

    private final CategoriaMapper cm;
    private final CategoriaRepositoryes cr;

    public CategoriaServiceImplement (CategoriaMapper cm, CategoriaRepositoryes cr){
    this.cm = cm;
    this.cr = cr;

    }

    @Override
    public CategoriaDto getCategoria(Integer id_categoria) {
        return cr.findById(id_categoria).map(cm::toCategoriaDto).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada por id:" + id_categoria));
    
    }

    @Override
    @Transactional
    public CategoriaDto saveCategoria(CategoriaDto categoriaDto) {
        Categoria categoria = cm.toCategoria(categoriaDto);
        Categoria catGuardado = cr.save(categoria);
        return cm.toCategoriaDto(catGuardado);
        
    }

    @Override
    @Transactional
    public List<CategoriaDto> getCategoria() {
        return cr.findAll().stream().map(cm::toCategoriaDto).toList();
        
            
        }
    

    @Override
    public void deleteCategoria(Integer id_categoria) {
        Categoria categoria = cr.findById(id_categoria).orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada por id: " + id_categoria)); 
        cr.delete(categoria);
    }

    @Override
    @Transactional
    public CategoriaDto updateCategoria(CategoriaDto categoriaDto) {
        Categoria categoria = cr.findById(categoriaDto.getIdCate())
        .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));

        categoria.setId_categoria(categoriaDto.getIdCate());
        categoria.setNomCate(categoriaDto.getNomCate());
        Categoria catActualizado = cr.save(categoria);
        return cm.toCategoriaDto(catActualizado);

    }
    


}
