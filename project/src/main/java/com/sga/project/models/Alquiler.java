package com.sga.project.models;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "alquiler")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Alquiler {
    @Id
    @Column(name = "id_alquiler")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(columnDefinition = "DATE")
    private LocalDate fechaRet;

    @NotNull
    @Column(columnDefinition = "DATE")
    private LocalDate fechaEnt;

    @NotNull
    @Column(columnDefinition = "DATE")
    private LocalDate fechaAlq;

    // El total se calcula automáticamente al asignar artículos
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer totalAlq = 0;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clienteDoc", nullable = false, foreignKey = @ForeignKey(name = "FK_alquiler_cliente"))
    private Clientes cliente;

    @OneToMany(mappedBy = "alquiler")
    private List<AlquilerArticulos> asignacionAlq;
}
