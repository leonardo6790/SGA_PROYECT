package com.sga.project.service;

import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sga.project.dto.UsuarioDto;
import com.sga.project.mapper.UsuarioMapper;
import com.sga.project.models.Barrio;
import com.sga.project.models.Rol;
import com.sga.project.models.TipoDoc;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.RolRepositoryes;
import com.sga.project.repositoryes.TipoDocRepositoryes;
import com.sga.project.repositoryes.UsuarioRepositoryes;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UsuarioServiceImplement implements UsuarioService {

private final UsuarioMapper usuMap;
private final UsuarioRepositoryes usuRepo;
private final RolRepositoryes rolRepo;
private final BarrioRepositoryes barRepo;
private final TipoDocRepositoryes tipDocRepo;
private final PasswordEncoder passwordEncoder;

public UsuarioServiceImplement (UsuarioMapper usuMap, UsuarioRepositoryes usuRepo, RolRepositoryes rolRepo, BarrioRepositoryes barRepo, TipoDocRepositoryes tipDocRepo, PasswordEncoder passwordEncoder) {
    this.usuMap = usuMap;
    this.usuRepo = usuRepo;
    this.rolRepo = rolRepo;
    this.barRepo = barRepo;
    this.tipDocRepo = tipDocRepo;
    this.passwordEncoder = passwordEncoder;
    
}

@Override
public UsuarioDto getUsuario (Integer numDoc) {
    return usuRepo.findById(numDoc).map(usuMap::toUsuarioDto).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado por el Numero de Documento: " + numDoc));
}

@Override
@Transactional
public UsuarioDto saveUsuario (UsuarioDto usuDto) {
    Usuario usuario = usuMap.toUsuario(usuDto);
    
    // Encriptar la contraseña antes de guardar
    if (usuario.getContraseña() != null && !usuario.getContraseña().isEmpty()) {
        usuario.setContraseña(passwordEncoder.encode(usuario.getContraseña()));
    }
    
    Usuario usuGuardado = usuRepo.save(usuario);
    return usuMap.toUsuarioDto(usuGuardado);

}

@Override
@Transactional
public List<UsuarioDto> getUsuarios () {
    return usuRepo.findAll().stream().map(usuMap::toUsuarioDto).toList();
}

@Override
public void deleteUsuario (Integer numDoc) {
    Usuario usuario = usuRepo.findById(numDoc).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado por el Numero de Documento: " + numDoc));
    usuRepo.delete(usuario);
}

@Override
@Transactional 
public UsuarioDto updateUsuario (UsuarioDto usuarioDto) {
    Usuario usu = usuRepo.findById(usuarioDto.getNumDocumento())
    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    
    // Actualizar campos básicos
    if (usuarioDto.getNombre1() != null) {
        usu.setNom1(usuarioDto.getNombre1());
    }
    if (usuarioDto.getNombre2() != null) {
        usu.setNom2(usuarioDto.getNombre2());
    }
    if (usuarioDto.getApellido1() != null) {
        usu.setApe1(usuarioDto.getApellido1());
    }
    if (usuarioDto.getApellido2() != null) {
        usu.setApe2(usuarioDto.getApellido2());
    }
    if (usuarioDto.getTele() != null) {
        usu.setNumTel(usuarioDto.getTele());
    }
    if (usuarioDto.getDire() != null) {
        usu.setDireccion(usuarioDto.getDire());
    }
    if (usuarioDto.getCorreoElectronico() != null) {
        usu.setCorreoElec(usuarioDto.getCorreoElectronico());
    }
    
    // Actualizar contraseña solo si se proporciona
    if (usuarioDto.getContra() != null && !usuarioDto.getContra().isEmpty()) {
        // Si la contraseña está encriptada (contiene $2a$ de bcrypt), no re-encriptar
        if (!usuarioDto.getContra().startsWith("$2a$")) {
            usu.setContraseña(passwordEncoder.encode(usuarioDto.getContra()));
        } else {
            usu.setContraseña(usuarioDto.getContra());
        }
    }
    
    if (usuarioDto.getActivo() != null) {
        usu.setActivo(usuarioDto.getActivo());
    }

    // Actualizar barrio si se proporciona
    if (usuarioDto.getIdBarrio() != null) {
        Barrio barrio = barRepo.findById(usuarioDto.getIdBarrio())
            .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado"));
        usu.setBarrio(barrio);
    }

    // Solo actualizar rol y tipoDoc si se proporcionan (son opcionales en actualización)
    if (usuarioDto.getIdRol() != null) {
        Rol rol = rolRepo.findById(usuarioDto.getIdRol())
            .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));
        usu.setRol(rol);
    }
    
    if (usuarioDto.getIdTipoDoc() != null) {
        TipoDoc tipDoc = tipDocRepo.findById(usuarioDto.getIdTipoDoc())
            .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado"));
        usu.setTipoDoc(tipDoc);
    }

    Usuario usuActualizado = usuRepo.save(usu);
    return usuMap.toUsuarioDto(usuActualizado);
}

@Override
@Transactional
public UsuarioDto toggleActivoUsuario(Integer numDoc, Boolean activo) {
    Usuario usuario = usuRepo.findById(numDoc)
        .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado por el Numero de Documento: " + numDoc));
    
    usuario.setActivo(activo);
    Usuario usuarioActualizado = usuRepo.save(usuario);
    return usuMap.toUsuarioDto(usuarioActualizado);
}


}
