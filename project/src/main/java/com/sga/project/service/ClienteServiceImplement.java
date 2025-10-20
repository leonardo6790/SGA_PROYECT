package com.sga.project.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sga.project.dto.ClientesDto;
import com.sga.project.mapper.ClientesMapper;
import com.sga.project.models.Clientes;
import com.sga.project.repositoryes.ClientesRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClienteServiceImplement implements ClienteService {

    private final ClientesRepository cr;
    private final ClientesMapper cm;

    public ClienteServiceImplement(ClientesRepository cr, ClientesMapper cm){
        this.cm = cm;
        this.cr = cr;
    }

    
    

    @Override
    @Transactional(readOnly = true)
    public ClientesDto getClienteById(Integer documCli) {
        Clientes clientes = cr.findById(documCli).get();
        return cm.toClientesDto(clientes);
    }

    @Override
    public ClientesDto saveCliente(ClientesDto clientesDto) {
        Clientes clientes = cm.toClientes(clientesDto);
        return cm.toClientesDto(clientes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientesDto> getListClientes() {
        return cr.findAll().stream().map(cm::toClientesDto).toList();
    }

    @Override
    public void deleteCliente(Integer documCli) {
        Clientes clientes = cr.findById(documCli).orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado" + documCli));
        cr.delete(clientes);
    }
}
