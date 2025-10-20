package com.sga.project.repositoryes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Categoria;

@Repository
public interface CategoriaRepositoryes extends JpaRepository <Categoria, Integer>{

}
