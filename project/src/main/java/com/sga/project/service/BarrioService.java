package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.BarrioDto;

public interface BarrioService {
    public BarrioDto getBarrio(Integer id_barrio);
    public BarrioDto saveBarrio(BarrioDto barrioDto);
    public List<BarrioDto> getListBarrios();
    public void deleteBarrio(Integer id_barrio);
    public BarrioDto updateBarrio(BarrioDto barrioDto);
}
