package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Entity
@Data
public class Rol {
    @Id
    @Column (name = "id_rol")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_rol;
    
    @Column(length = 20)
    private String nomRol;
}
