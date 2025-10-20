package com.sga.project.repositoryes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Barrio;

@Repository
public interface BarrioRepositoryes extends JpaRepository <Barrio, Integer>{

}
