package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.ClientesDto;

public interface ClienteService {

    public ClientesDto getClienteById (Integer documCli);
    public ClientesDto saveCliente (ClientesDto clientesDto);
    public List<ClientesDto> getListClientes();
    public void deleteCliente(Integer documCli);
}
