package com.sga.project.mapper;

import com.sga.project.dto.AlquilerDto;
import com.sga.project.models.Alquiler;

public interface AlquilerMapper {
    Alquiler toAlquiler (AlquilerDto alquilerDto);
    AlquilerDto toAlquilerDto (Alquiler alquiler);


    
}
