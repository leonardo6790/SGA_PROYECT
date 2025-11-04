package com.sga.project.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sga.project.dto.ClientesDto;
import com.sga.project.mapper.ClientesMapper;
import com.sga.project.models.Barrio;
import com.sga.project.models.Clientes;
import com.sga.project.models.TipoDoc;
import com.sga.project.repositoryes.BarrioRepositoryes;
import com.sga.project.repositoryes.ClientesRepository;
import com.sga.project.repositoryes.TipoDocRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClienteServiceImplement implements ClienteService {

    private final ClientesRepository cr;
    private final ClientesMapper cm;
    private final BarrioRepositoryes br;
    private final TipoDocRepositoryes tp;

    public ClienteServiceImplement(ClientesRepository cr, ClientesMapper cm, BarrioRepositoryes br, TipoDocRepositoryes tp){
        this.cm = cm;
        this.cr = cr;
        this.br = br;
        this.tp = tp;
    }

    
    

    @Override
    @Transactional(readOnly = true)
    public ClientesDto getClienteById(Integer documCli) {
        Clientes clientes = cr.findById(documCli)
            .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado: " + documCli));
        return cm.toClientesDto(clientes);
    }

    @Override
    @Transactional
    public ClientesDto saveCliente(ClientesDto clientesDto) {
        Clientes clientes = cm.toClientes(clientesDto);
        
        // Cargar las entidades relacionadas desde la base de datos
        if (clientesDto.getBarrioId() != null && clientesDto.getBarrioId() > 0) {
            Barrio barrio = br.findById(clientesDto.getBarrioId())
                .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado: " + clientesDto.getBarrioId()));
            clientes.setBarrio(barrio);
        } else {
            clientes.setBarrio(null);
        }
        
        if (clientesDto.getTipoDocId() != null && clientesDto.getTipoDocId() > 0) {
            TipoDoc tipoDoc = tp.findById(clientesDto.getTipoDocId())
                .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado: " + clientesDto.getTipoDocId()));
            clientes.setTipoDoc(tipoDoc);
        } else {
            clientes.setTipoDoc(null);
        }
        
        Clientes clienteGuardado = cr.save(clientes);
        return cm.toClientesDto(clienteGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientesDto> getListClientes() {
        return cr.findAll().stream().map(cm::toClientesDto).toList();
    }

    @Override
    @Transactional
    public void deleteCliente(Integer documCli) {
        Clientes clientes = cr.findById(documCli).orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado: " + documCli));
        cr.delete(clientes);
    }

    @Override
    @Transactional
    public ClientesDto updateCliente(ClientesDto clientesDto) {
        Clientes cli = cr.findById(clientesDto.getDoc())
        .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        cli.setNombre1(clientesDto.getNomcli1());
        cli.setNombre2(clientesDto.getNomcli2());
        cli.setApellido(clientesDto.getApecli1());
        cli.setApellido2(clientesDto.getApecli2());
        cli.setNumTel(clientesDto.getNumeroCli());
        cli.setCorreoElectronico(clientesDto.getCorreoElectronico());
        
        if (clientesDto.getActivo() != null) {
            cli.setActivo(clientesDto.getActivo());
        }
        
        if (clientesDto.getDireCli() != null) {
            cli.setDireccion(clientesDto.getDireCli());
        }
        
        if (clientesDto.getBarrioId() != null) {
            Barrio bar = br.findById(clientesDto.getBarrioId())
            .orElseThrow(() -> new EntityNotFoundException("Barrio no encontrado"));
            cli.setBarrio(bar);
        }

        if (clientesDto.getTipoDocId() != null) {
            TipoDoc tipoDoc = tp.findById(clientesDto.getTipoDocId())
            .orElseThrow(() -> new EntityNotFoundException("tipo de documento no encontrado"));
            cli.setTipoDoc(tipoDoc);
        }
        
        Clientes clienteActualizado = cr.save(cli);
        return cm.toClientesDto(clienteActualizado);
    }

    @Override
    @Transactional
    public ClientesDto toggleActivoCliente(Integer documCli, Boolean activo) {
        Clientes cliente = cr.findById(documCli)
            .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado: " + documCli));
        
        cliente.setActivo(activo);
        Clientes clienteActualizado = cr.save(cliente);
        return cm.toClientesDto(clienteActualizado);
    }
}
