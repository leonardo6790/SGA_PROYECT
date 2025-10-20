package com.sga.project.repositoryes;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sga.project.models.Rol;

public interface RolRepositoryes extends JpaRepository <Rol, Integer> {
    Optional<Rol> findByNomRol(String nomRol);
}
