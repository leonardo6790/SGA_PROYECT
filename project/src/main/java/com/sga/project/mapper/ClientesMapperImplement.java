package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.ClientesDto;
import com.sga.project.models.Barrio;
import com.sga.project.models.Clientes;
import com.sga.project.models.TipoDoc;

@Component
public class ClientesMapperImplement implements ClientesMapper {

    public ClientesMapperImplement(){
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
        clientes.setCorreoElectronico(clientesDto.getCorreoElectronico());

        // NO crear objetos Barrio y TipoDoc aquí
        // El servicio se encargará de cargarlos desde la base de datos
        
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
            clientes.getCorreoElectronico(),
            clientes.getBarrio() != null ? clientes.getBarrio().getId_barrio() : null,
            clientes.getTipoDoc() != null ? clientes.getTipoDoc().getId_tipoDoc() : null
        );
    }

}
