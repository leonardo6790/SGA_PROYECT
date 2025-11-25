package com.sga.project.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AlquilerAsignadoDto {
    private Integer alquilerId;
    private LocalDate fechaAlqui;
    private LocalDate fechaEntrega;
    private LocalDate fechaRetiro;
}
