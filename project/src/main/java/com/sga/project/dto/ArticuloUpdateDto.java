package com.sga.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ArticuloUpdateDto {

    @NotNull
    private Integer idArt;

    private String nombre;
    private String generoArt;
    private String tallaArt;
    private String colorArt;

    @NotNull
    private Integer precioArt;

    private String fotoArt;
    private Boolean activo;
    private Integer idCategoria;
}
