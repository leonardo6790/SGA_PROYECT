package com.sga.project.repositoryes;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Clientes;
import java.util.List;


@Repository
public interface ClientesRepository extends JpaRepository <Clientes, Integer> {
    Optional<Clientes> findByDocCliente(Integer docCliente);
}
