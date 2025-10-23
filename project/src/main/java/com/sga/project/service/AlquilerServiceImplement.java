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
    
    // Inicializar el total en 0 si no viene en el DTO
    if (alquiler.getTotalAlq() == null) {
        alquiler.setTotalAlq(0);
    }
    
    Alquiler alquiGuardado = alquiRepo.save(alquiler);

    // Calcular el total basado en los artículos asignados (si los hay)
    List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(alquiGuardado.getId());
    
    if (!articulos.isEmpty()) {
        Integer total = articulos.stream()
            .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
            .sum();
        alquiGuardado.setTotalAlq(total);
        alquiGuardado = alquiRepo.save(alquiGuardado);
    }
    
    return alquiMap.toAlquilerDto(alquiGuardado);
    }
    
    @Override
    @Transactional
    public AlquilerDto getAlquilerById (Integer idAlquiler) {
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
        // Recalcular el total antes de devolver
        calcularTotalAlquiler(idAlquiler);
        
        // Refrescar la entidad para obtener el total actualizado
        alquiler = alquiRepo.findById(idAlquiler).get();
        
        return alquiMap.toAlquilerDto(alquiler);
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

    @Override
    @Transactional
    public void calcularTotalAlquiler(Integer idAlquiler) {
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(idAlquiler);
        // Usar el precio de la asignación (AlquilerArticulos.precio) en lugar del precio del artículo
        Integer total = articulos.stream()
            .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
            .sum();

        Alquiler alquiler = alquiRepo.findById(idAlquiler)
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        alquiler.setTotalAlq(total);
        alquiRepo.save(alquiler);

    }

}
