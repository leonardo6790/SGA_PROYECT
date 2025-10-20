package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity

public class Barrio {
    @Id
    @Column(name = "id_barrio")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id_barrio;

    @Column (length = 20)
    private String nomBar;
}
