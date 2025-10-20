package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table (name = "usuario")
public class Usuario {

    @Id
    @Column (name = "numDoc")
    private Integer numDoc;

    @Column(length = 20, nullable = false)
    private String nom1;

    @Column(length = 20)
    private String nom2;

    @Column(length = 20, nullable = false)
    private String ape1;

    @Column(length = 20)
    private String ape2;

    @Column(length = 35, nullable = false)
    private String direccion;

    @Column(nullable = false)
    private Long numTel;

    @Column(length = 100, nullable = false)
    private String correoElec;

    @Column(length = 200, nullable = false)
    private String contraseña;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn( name = "id_barrio", nullable = false, foreignKey =  @ForeignKey(name = "FK_usuario_barrio"))
    private Barrio barrio;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipoDoc", nullable = false, foreignKey = @ForeignKey(name = "FK_usuarios_documento"))
    private TipoDoc tipoDoc;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol", nullable = false, foreignKey = @ForeignKey(name = "FK_usuarios_rol"))
    private Rol rol;
}
