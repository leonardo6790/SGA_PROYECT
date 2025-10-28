package com.sga.project.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.Clientes;
import com.sga.project.repositoryes.ClientesRepository;

import jakarta.persistence.EntityNotFoundException;

@Component 
class AlquilermapperImplement implements AlquilerMapper{

    private final ClientesRepository clienteRepo;

    public AlquilermapperImplement (ClientesRepository clienteRepo) {
        this.clienteRepo = clienteRepo;
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
        alquiler.setTotalAlq(alquilerDto.getTotalAlquiler());

        Clientes cliente = clienteRepo.findById(alquilerDto.getClienteDoc())
            .orElseThrow(()-> new EntityNotFoundException("Cliente no encontrado"));
        alquiler.setCliente(cliente);
        return alquiler;
    }

    @Override
    public AlquilerDto toAlquilerDto(Alquiler alquiler) {
        if (alquiler == null){
            return null;
        }

        List<AlquilerArticulosDto> articulosDto = new ArrayList<>();
        // NO intentar acceder a asignacionAlq si es proxy
        
        Integer clienteDoc = null;
        // NO intentar acceder a cliente si es proxy
        
        return new AlquilerDto(
            alquiler.getId(),
            alquiler.getFechaRet(),
            alquiler.getFechaEnt(),
            alquiler.getFechaAlq(),
            alquiler.getTotalAlq(),
            clienteDoc,
            articulosDto
        );
    }
}


