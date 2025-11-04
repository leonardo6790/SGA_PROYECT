package com.sga.project.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AlquilerDto {
    private Integer id_alquiler;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaRetiro;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaEntrega;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaAlquiler;
    
    private Integer totalAlquiler;
    private Integer clienteDoc;
    private Boolean activo;
    private List<AlquilerArticulosDto> articulos;
    private List<PagoDto> pagos;
    private Integer totalPagado;  // Calculado por el backend
    private Integer saldoPendiente;  // Calculado por el backend
}
