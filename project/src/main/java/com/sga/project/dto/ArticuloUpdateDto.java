package com.sga.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ArticuloUpdateDto {

    @NotNull
    private Integer idArt;

    @NotNull
    private Integer precioArti;

    @NotNull
    private String fotoArti;
}
