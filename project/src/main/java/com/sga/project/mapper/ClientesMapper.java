package com.sga.project.mapper;

import com.sga.project.dto.ClientesDto;
import com.sga.project.models.Clientes;

public interface ClientesMapper {
    Clientes toClientes (ClientesDto clientesDto);
    ClientesDto toClientesDto (Clientes clientes);
}
