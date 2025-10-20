package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.ArticuloDto;
import com.sga.project.dto.ArticuloUpdateDto;

public interface ArticuloService {

public ArticuloDto getArticuloById (Integer idArt);
public ArticuloDto saveArticulo (ArticuloDto articuloDto);
public List <ArticuloDto> getListArticulos ();
public void deleteArticulo (Integer idArt);
public ArticuloDto updateArticulo (ArticuloUpdateDto artiUpdateDto);
public List<ArticuloDto> getArticulosByName (String nomArt);
public List<ArticuloDto> getArticulosByCate (String nomCate);
}
