package com.sga.project.mapper;

import com.sga.project.dto.UsuarioDto;
import com.sga.project.models.Usuario;

public interface UsuarioMapper {

Usuario toUsuario (UsuarioDto usuarioDto);
UsuarioDto toUsuarioDto (Usuario usuario);
}
