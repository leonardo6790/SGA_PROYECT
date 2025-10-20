package com.sga.project.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.mapper.AlquilerMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class AlquilerServiceImplement implements AlquilerService{

    private final AlquilerMapper alquiMap;
    private final AlquilerRepositoryes alquiRepo;

    public AlquilerServiceImplement (AlquilerMapper alquiMap, AlquilerRepositoryes alquiRepo) {
        this.alquiMap = alquiMap;
        this.alquiRepo = alquiRepo;
    }
    
    @Override
    @Transactional
    public AlquilerDto saveAlquiler(AlquilerDto alquilerDto) {
    Alquiler alquiler = alquiMap.toAlquiler(alquilerDto);
    Alquiler alquiGuardado = alquiRepo.save(alquiler);
    return alquiMap.toAlquilerDto(alquiGuardado);
    }
    
    @Override
    public AlquilerDto getAlquilerById (Integer idAlquiler) {
        return alquiRepo.findById(idAlquiler).map(alquiMap::toAlquilerDto).orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
    }
    
    @Override
    public void deleteAlquiler (Integer idAlquiler) {
        Alquiler alqui = alquiRepo.findById(idAlquiler).orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado por el ID: " + idAlquiler));
        alquiRepo.delete(alqui);
    }

    @Override
    @Transactional
    public AlquilerDto updateAlquiler (AlquilerDto alquiDto) {
        Alquiler alqui = alquiRepo.findById(alquiDto.getId_alquiler())
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
        alqui.setFechaEnt(alquiDto.getFechaEntrega());
        alqui.setFechaRet(alquiDto.getFechaRetiro());
        
        Alquiler actualizado = alquiRepo.save(alqui);
        return alquiMap.toAlquilerDto(actualizado);
    }

    @Override
    @Transactional
    public List<AlquilerDto> getAlquilerList () {
        return alquiRepo.findAll().stream().map(alquiMap::toAlquilerDto).toList();
    }

    

}
