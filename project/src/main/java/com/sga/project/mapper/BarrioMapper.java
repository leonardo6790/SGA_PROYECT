package com.sga.project.mapper;

import com.sga.project.dto.BarrioDto;
import com.sga.project.models.Barrio;

public interface BarrioMapper {

    Barrio toBarrio(BarrioDto barrioDto);
    BarrioDto toBarrioDto(Barrio barrio);

}
