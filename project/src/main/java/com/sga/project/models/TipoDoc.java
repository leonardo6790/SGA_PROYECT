package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.Data;


@Entity
@Data
@Table(name = "tipoDoc")
public class TipoDoc {
    @Id
    @Column(name = "id_tipoDoc")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id_tipoDoc;

    @Column (length = 40)
    private String nomDoc;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean activo;
}
