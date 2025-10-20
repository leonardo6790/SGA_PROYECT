package com.sga.project.models;



import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table (name = "articulo")
public class Articulo {
@Id
@Column (name = "id_articulo")
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Integer id;

@Column (length = 50, nullable = false)
private String nomArt;

@Column (length = 50)
private String genero;

@Column (length = 10)
private String talla;

@Column (length  = 50)
private String color;

@Column (nullable = false)
private Integer precio;

private String foto;

@ManyToOne (fetch = FetchType.LAZY)
@JoinColumn (name = "id_categoria", nullable = false, foreignKey = @ForeignKey (name = "FK_articulo_categoria"))
private Categoria categoria;

@OneToMany (mappedBy = "articulo", cascade = CascadeType.ALL, orphanRemoval = true)
private List<AlquilerArticulos> asignacionArt = new ArrayList<>();
}
