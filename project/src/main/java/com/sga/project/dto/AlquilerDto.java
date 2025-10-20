package com.sga.project.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AlquilerDto {
    private Integer Id_alquiler;
    private Date fechaRetiro;
    private Date fechaEntrega;
    private Date fechaAlquiler;
    private Integer numDocUsuario;
}
