package com.sga.project.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.sga.project.dto.ArticuloDto;
import com.sga.project.mapper.ArticuloMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.Articulo;
import com.sga.project.models.Categoria;
import com.sga.project.repositoryes.AlquilerArticuloRepository;
import com.sga.project.repositoryes.ArticuloRepositoryes;
import com.sga.project.repositoryes.CategoriaRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@SuppressWarnings("null")
public class ArticuloServiceImplement implements ArticuloService{

    private final ArticuloMapper artiMap;
    private final ArticuloRepositoryes artiRepo;
    private final CategoriaRepositoryes cateRepo;
    private final AlquilerArticuloRepository alquiArtiRepo;


    public ArticuloServiceImplement (ArticuloMapper artiMap, ArticuloRepositoryes artiRepo, CategoriaRepositoryes cateRepo, AlquilerArticuloRepository alquiArtiRepo) {
    this.artiMap = artiMap;
    this.artiRepo = artiRepo;
    this.cateRepo = cateRepo;
    this.alquiArtiRepo = alquiArtiRepo;

}

@Override
public ArticuloDto getArticuloById (Integer idArt) {
    return artiRepo.findById(idArt).map(artiMap::toArticuloDto).orElseThrow(() -> new EntityNotFoundException("Articulo no encontrado por el ID: " + idArt));
}

@Override
@Transactional
public ArticuloDto saveArticulo (ArticuloDto articuloDto) {
    Articulo arti = artiMap.toArticulo(articuloDto);
    Articulo artiGuardado = artiRepo.save(arti);
    return artiMap.toArticuloDto(artiGuardado);
}

@Override
@Transactional
public List<ArticuloDto> getListArticulos () {
    // Retornar TODOS los artículos (sin filtrar por activo)
    // La disponibilidad se valida por fechas de alquiler, no por el campo activo
    return artiRepo.findAll().stream()
        .map(artiMap::toArticuloDto)
        .toList();
}

@Override
@Transactional
public void deleteArticulo (Integer idArt){
    Articulo arti = artiRepo.findById(idArt).orElseThrow(() -> new EntityNotFoundException("Articulo no encontrado por el ID: " + idArt));
    artiRepo.delete(arti);
}

@Override
@Transactional
public ArticuloDto updateArticulo (ArticuloDto articuloDto) {
    Articulo art = artiRepo.findById(articuloDto.getIdArt())
    .orElseThrow(() -> new EntityNotFoundException("Articulo no encontrado"));

    // Actualizar campos si se proporcionan
    if (articuloDto.getNombre() != null && !articuloDto.getNombre().isEmpty()) {
        art.setNomArt(articuloDto.getNombre());
    }
    
    if (articuloDto.getGeneroArt() != null) {
        art.setGenero(articuloDto.getGeneroArt());
    }
    
    if (articuloDto.getTallaArt() != null) {
        art.setTalla(articuloDto.getTallaArt());
    }
    
    if (articuloDto.getColorArt() != null) {
        art.setColor(articuloDto.getColorArt());
    }

    if (articuloDto.getPrecioArt() != null) {
        art.setPrecio(articuloDto.getPrecioArt());
    }
    
    if (articuloDto.getFotoArt() != null) {
        art.setFoto(articuloDto.getFotoArt());
    }
    
    if (articuloDto.getActivo() != null) {
        art.setActivo(articuloDto.getActivo());
    }
    
    // Si se proporciona una nueva categoría, actualizarla
    if (articuloDto.getIdCategoria() != null) {
        Categoria categoria = cateRepo.findById(articuloDto.getIdCategoria())
            .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con ID: " + articuloDto.getIdCategoria()));
        art.setCategoria(categoria);
    }

    Articulo artiActualizado = artiRepo.save(art);
    return artiMap.toArticuloDto(artiActualizado);
}

@Override
public List<ArticuloDto> getArticulosByName (String nomArt) {
    List<Articulo> arti = artiRepo.findByNomArtContainingIgnoringCase(nomArt);
    if (arti.isEmpty()) {
        throw new EntityNotFoundException("No se encontraron articulos por el nombre: " + nomArt );
    }
    return arti.stream().map(artiMap::toArticuloDto).collect(Collectors.toList());
}

@Override 
public List<ArticuloDto> getArticulosByCate (String nomCate) {
    List<Articulo> articulo = artiRepo.findByCategoriaNomCateContainingIgnoringCase(nomCate);
    if (articulo.isEmpty()) {
        throw new EntityNotFoundException("No hay articlos existentes con esta categoria: " + articulo);
        
    }

    return articulo.stream().map(artiMap:: toArticuloDto).collect(Collectors.toList());

}

@Override
@Transactional
public ArticuloDto toggleActivoArticulo(Integer idArt, Boolean activo) {
    Articulo articulo = artiRepo.findById(idArt)
        .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado por el ID: " + idArt));
    
    articulo.setActivo(activo);
    Articulo articuloActualizado = artiRepo.save(articulo);
    return artiMap.toArticuloDto(articuloActualizado);
}

@Override
@Transactional
public boolean verificarDisponibilidadPorFechas(Integer idArt, String fechaInicio, String fechaFin) {
    // Obtener todos los alquileres del artículo
    List<AlquilerArticulos> alquileres = alquiArtiRepo.findByArticuloId(idArt);
    
    // Convertir strings a LocalDate
    java.time.LocalDate fecha2Inicio = java.time.LocalDate.parse(fechaInicio);
    java.time.LocalDate fecha2Fin = java.time.LocalDate.parse(fechaFin);
    
    // Verificar si hay algún conflicto con las fechas
    for (AlquilerArticulos aa : alquileres) {
        // Solo verificar alquileres que no han sido devueltos
        if (!aa.getEstado()) {
            Alquiler alquiler = aa.getAlquiler();
            // Verificar solapamiento de fechas
            if (hayConflictoDeFechas(alquiler.getFechaEnt(), alquiler.getFechaRet(), fecha2Inicio, fecha2Fin)) {
                return false; // No disponible
            }
        }
    }
    
    return true; // Disponible
}

/**
 * Verifica si dos rangos de fechas se solapan
 */
private boolean hayConflictoDeFechas(java.time.LocalDate fecha1Inicio, java.time.LocalDate fecha1Fin, java.time.LocalDate fecha2Inicio, java.time.LocalDate fecha2Fin) {
    if (fecha1Inicio == null || fecha1Fin == null || fecha2Inicio == null || fecha2Fin == null) {
        return false;
    }
    return !(fecha2Fin.isBefore(fecha1Inicio) || fecha2Inicio.isAfter(fecha1Fin));
}
}
