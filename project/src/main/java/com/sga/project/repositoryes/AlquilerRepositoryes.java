package com.sga.project.repositoryes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Alquiler;

@Repository
public interface AlquilerRepositoryes extends JpaRepository <Alquiler, Integer>{

}
