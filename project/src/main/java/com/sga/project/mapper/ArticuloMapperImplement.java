package com.sga.project.mapper;

import org.springframework.stereotype.Component;
import com.sga.project.dto.ArticuloDto;
import com.sga.project.models.Articulo;
import com.sga.project.models.Categoria;
import com.sga.project.repositoryes.CategoriaRepositoryes;
import jakarta.persistence.EntityNotFoundException;

@Component class ArticuloMapperImplement implements ArticuloMapper{

    private final CategoriaRepositoryes cateRepo;

    public ArticuloMapperImplement (CategoriaRepositoryes cateRepo) {
        this.cateRepo = cateRepo;
    }

    @Override
    public Articulo toArticulo(ArticuloDto articuloDto) {
if (articuloDto == null){
        return null;
    }
    Articulo articulo = new Articulo();
    articulo.setId(articuloDto.getIdArt());
    articulo.setGenero(articuloDto.getGeneroArt());
    articulo.setTalla(articuloDto.getTallaArt());
    articulo.setColor(articuloDto.getColorArt());
    articulo.setNomArt(articuloDto.getNombre());
    articulo.setPrecio(articuloDto.getPrecioArt());
    articulo.setFoto(articuloDto.getFotoArt());

    Categoria cate = cateRepo.findById(articuloDto.getIdCategoria())
        .orElseThrow(() -> new EntityNotFoundException("Categoria no encontrada"));
        articulo.setCategoria(cate);

    return articulo;

    }

    

    @Override
    public ArticuloDto toArticuloDto(Articulo articulo) {
    if (articulo == null){
        return null;
    }
    return new ArticuloDto(
        articulo.getId(),
        articulo.getGenero(),
        articulo.getTalla(),
        articulo.getColor(),
        articulo.getNomArt(),
        articulo.getPrecio(),
        articulo.getFoto(),
        articulo.getCategoria() != null ? articulo.getCategoria().getId_categoria() :null,
        articulo.getCategoria() != null ? articulo.getCategoria().getNomCate() : null
    );
    }


}




