package com.sga.project.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UsuarioDto {
    private Integer numDocumento;
    private String nombre1;
    private String nombre2;
    private String apellido1;
    private String apellido2;
    private String dire;
    private Long tele;
    private String correoElectronico;
    private String contra;
    private Integer idBarrio;
    private String nomBar;
    private Integer idTipoDoc;
    private Integer idRol;
}
