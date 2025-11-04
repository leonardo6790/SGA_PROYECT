package com.sga.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TipoDocDto {
    private Integer idTipoDoc;
    
    @NotBlank(message = "El nombre del tipo de documento es obligatorio")
    @Size(max = 40, message = "El nombre del tipo de documento no puede exceder 40 caracteres")
    private String nomDoc;
    
    private Boolean activo;
}
