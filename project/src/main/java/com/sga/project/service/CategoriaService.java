package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.CategoriaDto;

public interface CategoriaService {
    public CategoriaDto getCategoria (Integer id_categoria);
    public CategoriaDto saveCategoria (CategoriaDto categoriaDto);
    public List <CategoriaDto> getCategoria ();
    public void deleteCategoria (Integer id_categoria);
    public CategoriaDto updateCategoria (CategoriaDto categoriaDto);

}
