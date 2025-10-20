package com.sga.project.mapper;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerAsignadoDto;
import com.sga.project.dto.ArticuloAsignadoDto;
import com.sga.project.models.AlquilerArticulos;

public interface AlquilerArticuloMapper{

    AlquilerArticulos toAlquilerArticulos(AlquilerArticulosDto alquilerArticulosDto);

    AlquilerArticulosDto toAlquilerArticulosDto(AlquilerArticulos alquilerArticulos);

    ArticuloAsignadoDto toArticuloAsignadoDto (AlquilerArticulos alquiArtiEntity);

    AlquilerAsignadoDto toAlquilerAsignadoDto (AlquilerArticulos alquiArtiEntity);
}
