package com.sga.project.repositoryes;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Pago;

@Repository
public interface PagoRepositoryes extends JpaRepository <Pago, Integer>{
    
    @Query("SELECT p FROM Pago p WHERE p.alquiler.id = :alquilerId")
    List<Pago> findByAlquilerId(@Param("alquilerId") Integer alquilerId);
}

