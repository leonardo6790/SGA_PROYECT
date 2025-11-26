package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table( name = "clientes")
public class Clientes {

    @Id
    @Column(name = "docCliente")
    private Integer docCliente;

    @NotNull
    private String nombre1;

    private String nombre2;

    @NotNull
    private String apellido;

    private String apellido2;

    @NotNull
    private String direccion;

    @NotNull
    private Long numTel;

    @NotNull
    @Column(length = 100)
    private String correoElectronico;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean activo = true;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "id_barrio", nullable = true, foreignKey = @ForeignKey(name = "FK_clientes_barrio"))
    private Barrio barrio;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipoDoc", nullable = true, foreignKey = @ForeignKey(name = "FK_clientes_tipoDoc"))
    private TipoDoc tipoDoc;
}
