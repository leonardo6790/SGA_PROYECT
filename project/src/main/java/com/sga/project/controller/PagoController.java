package com.sga.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sga.project.dto.PagoDto;
import com.sga.project.mapper.PagoMapper;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.PagoRepositoryes;
import com.sga.project.service.PagoService;

import jakarta.persistence.EntityNotFoundException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {
    private final PagoRepositoryes pagoRepo;
    private final PagoMapper pagoMap;
    private final PagoService pagoServi;

    public PagoController(PagoRepositoryes pagoRepo, PagoMapper pagoMap, PagoService pagoServi) {
        this.pagoRepo = pagoRepo;
        this.pagoMap = pagoMap;
        this.pagoServi = pagoServi;

    }

    @PostMapping("/AñadirPago")
    public ResponseEntity<?> crear(@Valid @RequestBody PagoDto pagoDto) {
        try {
            System.out.println("=== Recibiendo pago ===");
            System.out.println("ID Alquiler: " + pagoDto.getIdAlquiler());
            System.out.println("Valor Abono: " + pagoDto.getValAbo());
            System.out.println("Fecha: " + pagoDto.getFechaUltimoAbono());
            
            PagoDto añadir = pagoServi.savePago(pagoDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje", "Pago añadido", "data", añadir));
        } catch (IllegalStateException exception) {
            System.err.println("Error IllegalStateException: " + exception.getMessage());
            exception.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", exception.getMessage()));
        } catch (Exception ex) {
            System.err.println("Error al añadir pago: " + ex.getMessage());
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al añadir un pago", "detalle", ex.getMessage()));
        }

    }

    @GetMapping("/ConsultarById/{idPago}")
    public PagoDto getPagoById(@PathVariable Integer idPago) {
        return pagoRepo.findById(idPago).map(pagoMap::toPagoDto)
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado por el ID: " + idPago));
    }

    @GetMapping("/ConsultarPagos")
    public List<PagoDto> getListPagos() {
        return pagoRepo.findAll().stream().map(pagoMap::toPagoDto).toList();
    }

    @GetMapping("/alquiler/{idAlquiler}")
    public ResponseEntity<List<PagoDto>> getPagosByAlquiler(@PathVariable Integer idAlquiler) {
        try {
            List<PagoDto> pagos = pagoServi.getPagosByAlquiler(idAlquiler);
            return ResponseEntity.ok(pagos);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/Eliminar/{idPago}")
    public void deletePago(@PathVariable Integer idPago) {
        Pago pago = pagoRepo.findById(idPago).orElseThrow(() -> new EntityNotFoundException("Pago no encontrado"));
        pagoRepo.delete(pago);
    }

    @PutMapping("/actualizar/{idPago}")
    public ResponseEntity<?> actualizarPago(@PathVariable Integer idPago, @Valid @RequestBody PagoDto pagoDto) {
        try {
            pagoDto.setIdPago(idPago);
            PagoDto pagoActualizado = pagoServi.updatePago(pagoDto);
            return ResponseEntity.ok(Map.of("mensaje", "Pago actualizado correctamente", "data", pagoActualizado));
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el pago", "detalle", ex.getMessage()));
        }
    }
}
