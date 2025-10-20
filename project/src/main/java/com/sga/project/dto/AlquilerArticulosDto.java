package com.sga.project.dto;

import java.sql.Date;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AlquilerArticulosDto {

@NotNull (message = "El ID del Alquiler no puede estar vacío")
private Integer alquilerId;

@NotNull (message = "El ID del Articulo no puede estar vacío")
private Integer articuloId;

private String nomArticulo;

private String tallaArticulo;

private String nomCliente;

private Long telCliente;

private Date fechaEntrega;

private Boolean estado;

private Integer precio;

private String observaciones;
}