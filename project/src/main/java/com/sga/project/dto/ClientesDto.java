package com.sga.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ClientesDto {
    private Integer doc;
    private String nomcli1;
    private String nomcli2;
    private String apecli1;
    private String apecli2;
    private String direCli;
    private Long numeroCli;
    private Integer barrioId;
    private Integer tipoDocId;
}
