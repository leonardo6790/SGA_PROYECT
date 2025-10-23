package com.sga.project.repositoryes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;

@Repository
public interface AlquilerArticuloRepository extends JpaRepository <AlquilerArticulos, AlquilerArticulosId>{
    
    @Query("SELECT aa FROM AlquilerArticulos aa WHERE aa.id.alquilerId = :alquilerId")
    List<AlquilerArticulos> findByAlquilerId(@Param("alquilerId") Integer alquilerId);
    
    @Query("SELECT aa FROM AlquilerArticulos aa WHERE aa.id.articuloId = :articuloId")
    List<AlquilerArticulos> findByArticuloId(@Param("articuloId") Integer articuloId);
}
