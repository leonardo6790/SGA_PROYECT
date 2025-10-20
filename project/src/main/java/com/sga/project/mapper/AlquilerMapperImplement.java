package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.AlquilerDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.Usuario;
import com.sga.project.repositoryes.UsuarioRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Component class AlquilermapperImplement implements AlquilerMapper{

    private final UsuarioRepositoryes usuRepo;

    public AlquilermapperImplement (UsuarioRepositoryes usuRepo) {
        this.usuRepo = usuRepo;
    }

    @Override
    public Alquiler toAlquiler(AlquilerDto alquilerDto) {
    if (alquilerDto == null){
        return null;
    }
    Alquiler alquiler = new Alquiler();
    alquiler.setId(alquilerDto.getId_alquiler());
    alquiler.setFechaRet(alquilerDto.getFechaRetiro());
    alquiler.setFechaEnt(alquilerDto.getFechaEntrega());
    alquiler.setFechaAlq(alquilerDto.getFechaAlquiler());


    Usuario usu = usuRepo.findById(alquilerDto.getNumDocUsuario())
    .orElseThrow(()-> new EntityNotFoundException("Usuario no encontrado"));
    alquiler.setUsuario(usu);
    return alquiler;

    }

    @Override
    public AlquilerDto toAlquilerDto(Alquiler alquiler) {
    if (alquiler == null){
        return null;
    }

    return new AlquilerDto(
        alquiler.getId(),
        alquiler.getFechaRet(),
        alquiler.getFechaEnt(),
        alquiler.getFechaAlq(),
        alquiler.getUsuario() != null ? alquiler.getUsuario().getNumDoc() : null
    );

    }

}


