package com.sga.project.models;


import java.sql.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table (name = "alquiler")
public class Alquiler {
    @Id
    @Column (name = "id_alquiler")
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private Date fechaRet;
    
    @NotNull
    private Date fechaEnt;

    @NotNull
    private Date fechaAlq;


    @ManyToOne (fetch = FetchType.LAZY)

    @JoinColumn (name = "usuarioDoc", nullable = false, foreignKey = @ForeignKey(name = "FK_alquiler_usuario"))
    private Usuario usuario;

    @OneToMany (mappedBy = "alquiler")
    private List<AlquilerArticulos> asignacionAlq;
}
