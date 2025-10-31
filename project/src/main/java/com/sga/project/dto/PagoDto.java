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
    
    @JsonProperty("ValAbo")  // Mapea el JSON "ValAbo" a este campo
    private Integer valAbo;
    
    private Integer idAlquiler;
}
