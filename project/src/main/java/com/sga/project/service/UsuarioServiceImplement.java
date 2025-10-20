package com.sga.project.service;

import java.util.List;


import org.springframework.stereotype.Service;

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

public UsuarioServiceImplement (UsuarioMapper usuMap, UsuarioRepositoryes usuRepo, RolRepositoryes rolRepo, BarrioRepositoryes barRepo, TipoDocRepositoryes tipDocRepo) {
    this.usuMap = usuMap;
    this.usuRepo = usuRepo;
    this.rolRepo = rolRepo;
    this.barRepo = barRepo;
    this.tipDocRepo = tipDocRepo;
    
}

@Override
public UsuarioDto getUsuario (Integer numDoc) {
    return usuRepo.findById(numDoc).map(usuMap::toUsuarioDto).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado por el Numero de Documento: " + numDoc));
}

@Override
@Transactional
public UsuarioDto saveUsuario (UsuarioDto usuDto) {
    Usuario usuario = usuMap.toUsuario(usuDto);
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
    usu.setApe1(usuarioDto.getApellido1());
    usu.setApe2(usuarioDto.getApellido2());
    usu.setContraseña(usuarioDto.getContra());
    usu.setCorreoElec(usuarioDto.getCorreoElectronico());
    usu.setDireccion(usuarioDto.getDire());
    usu.setNom1(usuarioDto.getNombre1());
    usu.setNom2(usuarioDto.getNombre2());
    usu.setNumTel(usuarioDto.getTele());

    Rol rol = rolRepo.findById(usuarioDto.getIdRol())
        .orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));
    usu.setRol(rol);

    Barrio barrio = barRepo.findById(usuarioDto.getIdBarrio())
        .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado"));
    usu.setBarrio(barrio);

    TipoDoc tipDoc = tipDocRepo.findById(usuarioDto.getIdTipoDoc())
        .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado"));
        usu.setTipoDoc(tipDoc);

    Usuario usuActualizado = usuRepo.save(usu);
    return usuMap.toUsuarioDto(usuActualizado);
}


}
