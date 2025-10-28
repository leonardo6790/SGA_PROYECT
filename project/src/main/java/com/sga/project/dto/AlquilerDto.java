package com.sga.project.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AlquilerDto {
    private Integer id_alquiler;
    private Date fechaRetiro;
    private Date fechaEntrega;
    private Date fechaAlquiler;
    private Integer totalAlquiler;
    private Integer clienteDoc;
    private List<AlquilerArticulosDto> articulos;
}
