package com.sga.project.models;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class AlquilerArticulosId implements Serializable{
    private Integer alquilerId;
    private Integer articuloId;
}
