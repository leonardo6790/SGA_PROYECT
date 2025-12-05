package com.sga.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sga.project.dto.BarrioDto;
import com.sga.project.mapper.BarrioMapper;
import com.sga.project.models.Barrio;
import com.sga.project.repositoryes.BarrioRepositoryes;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@SuppressWarnings("null")
public class BarrioServiceImplement implements BarrioService {

    private final BarrioMapper barrioMapper;
    private final BarrioRepositoryes barrioRepository;

    public BarrioServiceImplement(BarrioMapper barrioMapper, BarrioRepositoryes barrioRepository) {
        this.barrioMapper = barrioMapper;
        this.barrioRepository = barrioRepository;
    }

    @Override
    public BarrioDto getBarrio(Integer id_barrio) {
        return barrioRepository.findById(id_barrio)
            .map(barrioMapper::toBarrioDto)
            .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado por id:" + id_barrio));
    }

    @Override
    @Transactional
    public BarrioDto saveBarrio(BarrioDto barrioDto) {
        Barrio barrio = barrioMapper.toBarrio(barrioDto);
        Barrio barrioGuardado = barrioRepository.save(barrio);
        return barrioMapper.toBarrioDto(barrioGuardado);
    }

    @Override
    @Transactional
    public List<BarrioDto> getListBarrios() {
        return barrioRepository.findAll().stream()
            .filter(barrio -> barrio.getActivo() != null && barrio.getActivo())
            .map(barrioMapper::toBarrioDto)
            .toList();
    }

    @Override
    @Transactional
    public void deleteBarrio(Integer id_barrio) {
        Barrio barrio = barrioRepository.findById(id_barrio)
            .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado por id: " + id_barrio));
        // Soft delete: marcar como inactivo en lugar de eliminar
        barrio.setActivo(false);
        barrioRepository.save(barrio);
    }

    @Override
    @Transactional
    public BarrioDto updateBarrio(BarrioDto barrioDto) {
        Barrio barrio = barrioRepository.findById(barrioDto.getIdBarrio())
            .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado"));

        barrio.setNomBar(barrioDto.getNombreBarrio());
        
        // Actualizar el estado activo si se proporciona
        if (barrioDto.getActivo() != null) {
            barrio.setActivo(barrioDto.getActivo());
        }
        
        Barrio barrioActualizado = barrioRepository.save(barrio);
        return barrioMapper.toBarrioDto(barrioActualizado);
    }
}
