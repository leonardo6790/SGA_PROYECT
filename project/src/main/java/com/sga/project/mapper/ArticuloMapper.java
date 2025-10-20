package com.sga.project.mapper;

import com.sga.project.dto.ArticuloDto;
import com.sga.project.models.Articulo;

public interface ArticuloMapper {

    Articulo toArticulo (ArticuloDto articuloDto);
    ArticuloDto toArticuloDto (Articulo articulo);


}
