package com.sga.project.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class AlquilerAsignadoDto {
    private Integer alquilerId;
    private Date fechaAlqui;
    private Date fechaEntrega;
    private Date fechaRetiro;
}
