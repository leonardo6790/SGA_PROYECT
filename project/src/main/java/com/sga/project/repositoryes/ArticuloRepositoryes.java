package com.sga.project.repositoryes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Articulo;

@Repository
public interface ArticuloRepositoryes extends JpaRepository <Articulo, Integer>{

    List<Articulo> findByNomArtContainingIgnoringCase(String nomArt);
    List<Articulo> findByCategoriaNomCateContainingIgnoringCase(String nomCate);
    
}
