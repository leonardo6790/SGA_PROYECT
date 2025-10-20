package com.sga.project.mapper;

import com.sga.project.dto.CategoriaDto;
import com.sga.project.models.Categoria;

public interface CategoriaMapper {

    Categoria toCategoria (CategoriaDto categoriaDto);
    CategoriaDto toCategoriaDto (Categoria categoria);

}
