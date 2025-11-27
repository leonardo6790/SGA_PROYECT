package com.sga.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PagoDto {
    private Integer idPago;
    private Integer fechaUltimoAbono;
    private Integer valAbo;
    private Integer idAlquiler;
}
