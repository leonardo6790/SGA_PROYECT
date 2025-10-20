package com.sga.project.repositoryes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Clientes;

@Repository
public interface ClientesRepository extends JpaRepository <Clientes, Integer> {

}
