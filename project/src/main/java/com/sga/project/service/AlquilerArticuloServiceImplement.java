package com.sga.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.mapper.AlquilerArticuloMapper;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;
import com.sga.project.repositoryes.AlquilerArticuloRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AlquilerArticuloServiceImplement implements AlquilerArticuloService{

    private final AlquilerArticuloRepository alquiArtiRepo;
    private final AlquilerArticuloMapper alquiArtiMap;

    public AlquilerArticuloServiceImplement(AlquilerArticuloRepository alquiArtiRepo, AlquilerArticuloMapper alquiArtiMap) {
        this.alquiArtiMap = alquiArtiMap;
        this.alquiArtiRepo = alquiArtiRepo;
    }

    @Override
    public AlquilerArticulosDto asignar(AlquilerArticulosDto alquiArtiDto) {
        AlquilerArticulos alqArt = alquiArtiMap.toAlquilerArticulos(alquiArtiDto);
        
        AlquilerArticulosId id = new AlquilerArticulosId(alquiArtiDto.getAlquilerId(), alquiArtiDto.getArticuloId());
        if (alquiArtiRepo.existsById(id)) {
            throw new IllegalStateException("Ya existe una asignación con ese alquiler y articulos");
        }

        AlquilerArticulos guardado = alquiArtiRepo.save(alqArt);

        return alquiArtiMap.toAlquilerArticulosDto(guardado);
    }

    @Override
    public List<AlquilerArticulosDto> listarPorAlquiler(Integer alquilerId) {
        return alquiArtiRepo.findByAlquilerId(alquilerId)
        .stream()
        .map(alquiArtiMap::toAlquilerArticulosDto)
        .collect(Collectors.toList());
    }
    
    @Override 
    public List<AlquilerArticulosDto> listarPorArticulo (Integer ArticuloId) {
        return alquiArtiRepo.findByArticuloId(ArticuloId)
        .stream()
        .map(alquiArtiMap::toAlquilerArticulosDto)
        .collect(Collectors.toList());
    }
@Override 
public void eliminarAsignacion (Integer articuloId, Integer alquilerId){
    AlquilerArticulosId id = new AlquilerArticulosId(alquilerId, articuloId);
    if (!alquiArtiRepo.existsById(id)) {
        throw new EntityNotFoundException("Asignación no encontrada");
    }
    alquiArtiRepo.deleteById(id);
}

@Override
public List<AlquilerArticulosDto> listarAlquileres() {
    return alquiArtiRepo.findAll().stream().map(alquiArtiMap::toAlquilerArticulosDto).toList();
}
}
