package com.sga.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AlquilerArticuloDto {
    private Integer articuloId;
    private Integer cantidad;
    private Integer precio;
    private Boolean estado;
    private String observaciones;
}
