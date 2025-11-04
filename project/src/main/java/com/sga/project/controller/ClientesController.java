package com.sga.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.ClientesDto;
import com.sga.project.service.ClienteService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("/api/cli")
public class ClientesController {
    @Autowired
    private ClienteService cs;

    @PostMapping("/crear")
    public ResponseEntity<ClientesDto> saveClientes(@Valid @RequestBody ClientesDto clientesDto) {
        ClientesDto save = cs.saveCliente(clientesDto);
        return ResponseEntity.ok(save);
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        cs.deleteCliente(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<ClientesDto>> listClients() {
        return ResponseEntity.ok(cs.getListClientes());
    }
    
    @GetMapping("consultarId/{id}")
        public ResponseEntity<ClientesDto> searchbyid(@PathVariable Integer id){
            ClientesDto clientesDto = cs.getClienteById(id);
            return ResponseEntity.ok(clientesDto);
        }
    
    @PutMapping("actualizar/{id}")
        public ResponseEntity<ClientesDto> update(@PathVariable Integer id,@Valid @RequestBody ClientesDto clientesDto) {
            clientesDto.setDoc(id);
            ClientesDto update = cs.updateCliente(clientesDto);
            return ResponseEntity.ok(update);
        }

    @PutMapping("activar/{id}")
    public ResponseEntity<ClientesDto> activarCliente(@PathVariable Integer id) {
        ClientesDto clienteActualizado = cs.toggleActivoCliente(id, true);
        return ResponseEntity.ok(clienteActualizado);
    }

    @PutMapping("desactivar/{id}")
    public ResponseEntity<ClientesDto> desactivarCliente(@PathVariable Integer id) {
        ClientesDto clienteActualizado = cs.toggleActivoCliente(id, false);
        return ResponseEntity.ok(clienteActualizado);
    }
}
