package com.sga.project.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.mapper.AlquilerMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;
import com.sga.project.models.Articulo;
import com.sga.project.repositoryes.AlquilerArticuloRepository;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import com.sga.project.repositoryes.ArticuloRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class AlquilerServiceImplement implements AlquilerService{

    private final AlquilerMapper alquiMap;
    private final AlquilerRepositoryes alquiRepo;
    private final AlquilerArticuloRepository alquiArtiRepo;
    private final ArticuloRepositoryes articuloRepo;

    public AlquilerServiceImplement (AlquilerMapper alquiMap, AlquilerRepositoryes alquiRepo, 
                                     AlquilerArticuloRepository alquiArtiRepo, ArticuloRepositoryes articuloRepo) {
        this.alquiMap = alquiMap;
        this.alquiRepo = alquiRepo;
        this.alquiArtiRepo = alquiArtiRepo;
        this.articuloRepo = articuloRepo;
    }
    
    @Override
    @Transactional
    public AlquilerDto saveAlquiler(AlquilerDto alquilerDto) {
        // Convertir DTO a entidad
        Alquiler alquiler = alquiMap.toAlquiler(alquilerDto);
        
        // Calcular total antes de guardar
        Integer total = 0;
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            total = alquilerDto.getArticulos().stream()
                .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
                .sum();
        }
        alquiler.setTotalAlq(total);
        
        // Guardar el alquiler
        Alquiler alquiGuardado = alquiRepo.save(alquiler);
        
        // Guardar los artículos del alquiler si existen
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            for (AlquilerArticulosDto artDto : alquilerDto.getArticulos()) {
                Articulo articulo = articuloRepo.findById(artDto.getArticuloId())
                    .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado: " + artDto.getArticuloId()));
                
                AlquilerArticulosId id = new AlquilerArticulosId(alquiGuardado.getId(), articulo.getId());
                AlquilerArticulos aa = new AlquilerArticulos();
                aa.setId(id);
                aa.setAlquiler(alquiGuardado);
                aa.setArticulo(articulo);
                aa.setPrecio(artDto.getPrecio());
                aa.setEstado(artDto.getEstado() != null ? artDto.getEstado() : false);
                aa.setObservaciones(artDto.getObservaciones());
                
                alquiArtiRepo.save(aa);
            }
        }
        
        // Recargar el alquiler para retornarlo
        Alquiler alquilerCompleto = alquiRepo.findById(alquiGuardado.getId())
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
        return alquiMap.toAlquilerDto(alquilerCompleto);
    }
    
    @Override
    @Transactional
    public AlquilerDto getAlquilerById (Integer idAlquiler) {
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
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
        List<Alquiler> alquileres = alquiRepo.findAll();
        return alquileres.stream().map(alquiMap::toAlquilerDto).toList();
    }

    

}
