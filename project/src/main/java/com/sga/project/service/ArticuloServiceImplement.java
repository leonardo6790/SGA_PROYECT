package com.sga.project.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.sga.project.dto.ArticuloDto;
import com.sga.project.mapper.ArticuloMapper;
import com.sga.project.models.Articulo;
import com.sga.project.models.Categoria;
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


    public ArticuloServiceImplement (ArticuloMapper artiMap, ArticuloRepositoryes artiRepo, CategoriaRepositoryes cateRepo) {
    this.artiMap = artiMap;
    this.artiRepo = artiRepo;
    this.cateRepo = cateRepo;

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
    // Solo retornar artículos disponibles (activo = true)
    return artiRepo.findAll().stream()
        .filter(articulo -> articulo.getActivo() != null && articulo.getActivo())
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
}
