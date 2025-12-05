package com.sga.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String rol;
    private String mensaje;
    private Integer numDoc;
    private String nom1;
    private String nom2;
    private String ape1;
    private String ape2;
    private String direccion;
    private Long numTel;
    private Boolean activo;
    private String tipoDoc;
    private String barrio;
}
