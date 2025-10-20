package com.sga.project.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "alquiler_articulos")
public class AlquilerArticulos {
    
    @EmbeddedId
    private AlquilerArticulosId id = new AlquilerArticulosId();

    @ManyToOne (fetch = FetchType.LAZY)
    @MapsId ("alquilerId")
    @JoinColumn (name = "id_alquiler", foreignKey = @ForeignKey (name = "FK_AlquilerArticulos_Alquiler"))
    private Alquiler alquiler;

    @ManyToOne (fetch = FetchType.LAZY)
    @MapsId ("articuloId")
    @JoinColumn (name = "id_articulo", foreignKey = @ForeignKey (name = "FK_AlquilerArticulos_Articulo"))
    private Articulo articulo;

    private Boolean estado; //Indica el  esatado del alquiler, si fue devuelto o no.

    private Integer precio;
    
    @Size (max = 200)
    private String observaciones;

    
}
