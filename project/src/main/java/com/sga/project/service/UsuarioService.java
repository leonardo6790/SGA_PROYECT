package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.UsuarioDto;

public interface UsuarioService {

public UsuarioDto getUsuario (Integer numDoc);
public UsuarioDto saveUsuario (UsuarioDto usuarioDto);
public List <UsuarioDto> getUsuarios ();
public void deleteUsuario(Integer numDoc);
public UsuarioDto updateUsuario (UsuarioDto usuarioDto);

}
