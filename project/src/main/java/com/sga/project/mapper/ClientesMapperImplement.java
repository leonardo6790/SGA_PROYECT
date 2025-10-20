package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.ClientesDto;
import com.sga.project.models.Barrio;
import com.sga.project.models.Clientes;
import com.sga.project.models.TipoDoc;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.TipoDocRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Component
public class ClientesMapperImplement implements ClientesMapper {
    private final BarrioRepositoryes br;
    private final TipoDocRepositoryes tr;

    public ClientesMapperImplement(BarrioRepositoryes br, TipoDocRepositoryes tr){
        this.br = br;
        this.tr = tr;
    }

    @Override
    public Clientes toClientes(ClientesDto clientesDto) {
        if (clientesDto == null) {
            return null;
        }
        Clientes clientes = new Clientes();
        clientes.setDocCliente(clientesDto.getDoc());
        clientes.setNombre1(clientesDto.getNomcli1());
        clientes.setNombre2(clientesDto.getNomcli2());
        clientes.setApellido(clientesDto.getApecli1());
        clientes.setApellido2(clientesDto.getApecli2());
        clientes.setDireccion(clientesDto.getDireCli());
        clientes.setNumTel(clientesDto.getNumeroCli());

        Barrio barrio = br.findById(clientesDto.getBarrioId())
        .orElseThrow(() -> new EntityNotFoundException("barrio no encontrado"));
        clientes.setBarrio(barrio);

        TipoDoc tipoDoc = tr.findById(clientesDto.getTipoDocId())
        .orElseThrow(() -> new EntityNotFoundException("tipo de documento no encontrado"));
        clientes.setTipoDoc(tipoDoc);
        return clientes;
    }

    @Override
    public ClientesDto toClientesDto(Clientes clientes) {
        if (clientes == null){
            return null;
        }
        return new ClientesDto(
            clientes.getDocCliente(),
            clientes.getNombre1(),
            clientes.getNombre2(),
            clientes.getApellido(),
            clientes.getApellido2(),
            clientes.getDireccion(),
            clientes.getNumTel(),
            clientes.getBarrio() != null ? clientes.getBarrio().getId_barrio() : null,
            clientes.getTipoDoc() != null ? clientes.getTipoDoc().getId_tipoDoc() : null
        );
    }

}
