package com.sga.project.repositoryes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sga.project.models.Pago;

@Repository
public interface PagoRepositoryes extends JpaRepository <Pago, Integer>{

}

