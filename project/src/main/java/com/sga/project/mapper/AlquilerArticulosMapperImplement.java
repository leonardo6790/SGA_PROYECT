package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerAsignadoDto;
import com.sga.project.dto.ArticuloAsignadoDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;
import com.sga.project.models.Articulo;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import com.sga.project.repositoryes.ArticuloRepositoryes;

import jakarta.persistence.EntityNotFoundException;


@Component
public class AlquilerArticulosMapperImplement implements AlquilerArticuloMapper{

    private final AlquilerRepositoryes alquilerRepo;
    private final ArticuloRepositoryes articuloRepo;
    
    public AlquilerArticulosMapperImplement(ArticuloRepositoryes articuloRepo, AlquilerRepositoryes alquilerRepo) {
        this.alquilerRepo = alquilerRepo;
        this.articuloRepo = articuloRepo;
    }
    
    @Override
    public AlquilerArticulos toAlquilerArticulos (AlquilerArticulosDto alquiArtiDto) {
        Alquiler alqui = alquilerRepo.findById(alquiArtiDto.getAlquilerId())
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        Articulo arti = articuloRepo.findById(alquiArtiDto.getArticuloId()) 
        .orElseThrow(() -> new EntityNotFoundException("Articulo no encontrado"));

        AlquilerArticulosId id = new AlquilerArticulosId(alquiArtiDto.getAlquilerId(), alquiArtiDto.getArticuloId());

        AlquilerArticulos alquiArti = new AlquilerArticulos();
        alquiArti.setId(id);
        alquiArti.setAlquiler(alqui);
        alquiArti.setArticulo(arti);
        alquiArti.setEstado(alquiArtiDto.getEstado());
        alquiArti.setObservaciones(alquiArtiDto.getObservaciones());
        
        // Si el DTO trae un precio, usarlo; si no, usar el precio del artículo
        if (alquiArtiDto.getPrecio() != null) {
            alquiArti.setPrecio(alquiArtiDto.getPrecio());
        } else {
            alquiArti.setPrecio(arti.getPrecio());
        }
        

        return alquiArti;

    }

    @Override
    public AlquilerArticulosDto toAlquilerArticulosDto (AlquilerArticulos entity) {
        String nombreCliente = "";
        Long telefonoCliente = null;
        
        if (entity.getAlquiler().getCliente() != null) {
            nombreCliente = entity.getAlquiler().getCliente().getNombre1() + " " + 
                          (entity.getAlquiler().getCliente().getApellido() != null ? entity.getAlquiler().getCliente().getApellido() : "");
            telefonoCliente = entity.getAlquiler().getCliente().getNumTel();
        }
        
        return new AlquilerArticulosDto(
            entity.getAlquiler().getId(),
            entity.getArticulo().getId(),
            entity.getArticulo().getNomArt(),
            entity.getArticulo().getTalla(),
            nombreCliente.trim(),
            telefonoCliente,
            entity.getAlquiler().getFechaEnt(),
            entity.getEstado(),
            entity.getPrecio(), // Usar el precio de la asignación, no del artículo
            entity.getObservaciones()
        );
    }

    @Override
    public ArticuloAsignadoDto toArticuloAsignadoDto (AlquilerArticulos alquiArtiEntity) {
        ArticuloAsignadoDto asigDto = new ArticuloAsignadoDto();
        asigDto.setArticuloId(alquiArtiEntity.getArticulo().getId());
        asigDto.setNomArticulo(alquiArtiEntity.getArticulo().getNomArt());
        asigDto.setPrecioArticulo(alquiArtiEntity.getArticulo().getPrecio());
        asigDto.setTallaArticulo(alquiArtiEntity.getArticulo().getTalla());

        return asigDto;
    }

    @Override
    public AlquilerAsignadoDto toAlquilerAsignadoDto (AlquilerArticulos alquiArtiEntity) {
        AlquilerAsignadoDto asigDto = new AlquilerAsignadoDto();
        asigDto.setAlquilerId(alquiArtiEntity.getAlquiler().getId());
        asigDto.setFechaAlqui(alquiArtiEntity.getAlquiler().getFechaAlq());
        asigDto.setFechaEntrega(alquiArtiEntity.getAlquiler().getFechaEnt());
        asigDto.setFechaRetiro(alquiArtiEntity.getAlquiler().getFechaRet());

        return asigDto;
    }
}
