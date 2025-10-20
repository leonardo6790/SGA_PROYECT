package com.sga.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Categoria {
@Id
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Integer id_categoria;

@Column (nullable = false, length = 50)
private String nomCate;

}
