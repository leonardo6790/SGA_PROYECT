package com.sga.project.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.mapper.AlquilerMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.repositoryes.AlquilerArticuloRepository;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class AlquilerServiceImplement implements AlquilerService{

    private final AlquilerMapper alquiMap;
    private final AlquilerRepositoryes alquiRepo;
    private final AlquilerArticuloRepository alquiArtiRepo;

    public AlquilerServiceImplement (AlquilerMapper alquiMap, AlquilerRepositoryes alquiRepo, AlquilerArticuloRepository alquiArtiRepo) {
        this.alquiMap = alquiMap;
        this.alquiRepo = alquiRepo;
        this.alquiArtiRepo = alquiArtiRepo;
    }
    
    @Override
    @Transactional

    public AlquilerDto saveAlquiler(AlquilerDto alquilerDto) {

    Alquiler alquiler = alquiMap.toAlquiler(alquilerDto);
    Alquiler alquiGuardado = alquiRepo.save(alquiler);

    List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(alquiGuardado.getId());

    Integer total = articulos.stream().mapToInt(a -> a.getArticulo().getPrecio()).sum();
    alquiGuardado.setTotalAlq(total);
    alquiRepo.save(alquiGuardado);
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
