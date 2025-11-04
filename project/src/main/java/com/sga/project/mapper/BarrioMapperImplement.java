package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.BarrioDto;
import com.sga.project.models.Barrio;

@Component
public class BarrioMapperImplement implements BarrioMapper {

    public BarrioMapperImplement() {
    }

    @Override
    public Barrio toBarrio(BarrioDto barrioDto) {
        if (barrioDto == null) {
            return null;
        }
        Barrio barrio = new Barrio();
        barrio.setId_barrio(barrioDto.getIdBarrio());
        barrio.setNomBar(barrioDto.getNombreBarrio());
        barrio.setActivo(barrioDto.getActivo() != null ? barrioDto.getActivo() : true);
        return barrio;
    }

    @Override
    public BarrioDto toBarrioDto(Barrio barrio) {
        if (barrio == null) {
            return null;
        }

        return new BarrioDto(
            barrio.getId_barrio(),
            barrio.getNomBar(),
            barrio.getActivo()
        );
    }
}
