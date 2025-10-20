package com.sga.project.mapper;

import org.springframework.stereotype.Component;
import com.sga.project.dto.UsuarioDto;
import com.sga.project.models.Barrio;
import com.sga.project.models.Rol;
import com.sga.project.models.TipoDoc;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.RolRepositoryes;
import com.sga.project.repositoryes.TipoDocRepositoryes;
import jakarta.persistence.EntityNotFoundException;

@Component class UsuarioMapperImplement implements UsuarioMapper {
    private final BarrioRepositoryes barRep;
    private final RolRepositoryes rolRep;
    private final TipoDocRepositoryes tipRe;

    public UsuarioMapperImplement(BarrioRepositoryes barRep, RolRepositoryes rolRep, TipoDocRepositoryes tipRe){
        this.barRep = barRep;
        this.rolRep = rolRep;
        this.tipRe = tipRe;
    }
    @Override
    public Usuario toUsuario(UsuarioDto usuarioDto) {
    if (usuarioDto == null) {
        return null;
    }
    Usuario usuario = new Usuario();
    usuario.setNumDoc(usuarioDto.getNumDocumento());
    usuario.setNom1(usuarioDto.getNombre1());
    usuario.setNom2(usuarioDto.getNombre2());
    usuario.setApe1(usuarioDto.getApellido1());
    usuario.setApe2(usuarioDto.getApellido2());
    usuario.setDireccion(usuarioDto.getDire());
    usuario.setNumTel(usuarioDto.getTele());
    usuario.setCorreoElec(usuarioDto.getCorreoElectronico());
    usuario.setContraseña(usuarioDto.getContra());
    
    Barrio barrio = barRep.findById(usuarioDto.getIdBarrio())
    .orElseThrow(() -> new EntityNotFoundException("barrio no encontrado"));
    usuario.setBarrio(barrio);

    Rol rol = rolRep.findById(usuarioDto.getIdRol())
    .orElseThrow(() -> new EntityNotFoundException("rol no encontrado"));
    usuario.setRol(rol);

    TipoDoc tipoDoc = tipRe.findById(usuarioDto.getIdTipoDoc())
    .orElseThrow(() -> new EntityNotFoundException("tipo de documento no encontrado mi papacho"));
    usuario.setTipoDoc(tipoDoc);
    return usuario;
    }
    
    @Override
    public UsuarioDto toUsuarioDto(Usuario usuario) {
    if (usuario == null) {
        return null;
    }
    return new UsuarioDto(
        usuario.getNumDoc(),
        usuario.getNom1(),
        usuario.getNom2(),
        usuario.getApe1(),
        usuario.getApe2(),
        usuario.getDireccion(),
        usuario.getNumTel(),
        usuario.getCorreoElec(),
        usuario.getContraseña(),
        usuario.getBarrio() != null ? usuario.getBarrio().getId_barrio() : null,
        usuario.getBarrio() != null? usuario.getBarrio().getNomBar() : null,
        usuario.getRol() != null ? usuario.getRol().getId_rol() : null,
        usuario.getTipoDoc() != null ? usuario.getTipoDoc().getId_tipoDoc() : null
    );
    }

}
