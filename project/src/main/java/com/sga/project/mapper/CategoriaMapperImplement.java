package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.CategoriaDto;
import com.sga.project.models.Categoria;

@Component class CategoriaMapperImplement implements CategoriaMapper {

public CategoriaMapperImplement () {
    }

@Override
public Categoria toCategoria (CategoriaDto categoriaDto) {
    if (categoriaDto == null) {
        return null;
        
    }
    Categoria categoria = new Categoria();
    categoria.setId_categoria(categoriaDto.getIdCate());
    categoria.setNomCate(categoriaDto.getNomCate());
    categoria.setActivo(categoriaDto.getActivo() != null ? categoriaDto.getActivo() : true);
    return categoria;
}
@Override
public CategoriaDto toCategoriaDto (Categoria categoria) {
    if (categoria == null) {
        return null;
    
    }

    return new CategoriaDto(
        categoria.getId_categoria(),
        categoria.getNomCate(),
        categoria.getActivo()
    );
}


}
