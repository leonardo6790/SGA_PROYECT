package com.sga.project.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.PagoDto;
import com.sga.project.mapper.PagoMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import com.sga.project.repositoryes.PagoRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
@SuppressWarnings("null")
public class PagoServiceImplement implements PagoService {

    private final PagoRepositoryes pr;
    private final PagoMapper pm;
    private final AlquilerRepositoryes ar;

    public PagoServiceImplement(PagoRepositoryes pr, PagoMapper pm, AlquilerRepositoryes ar) {
        this.pm = pm;
        this.pr = pr;
        this.ar = ar;
    }

    @Override
    @Transactional(readOnly = true)
    public PagoDto getPagoById(Integer idPago) {
        Pago pago = pr.findById(idPago).get();
        return pm.toPagoDto(pago);
    }

    @Override
    @Transactional
    public PagoDto savePago(PagoDto pagoDto) {
        // Generar automáticamente la fecha actual en formato yyyyMMdd
        LocalDate fechaActual = LocalDate.now();
        Integer fechaComoEntero = Integer.parseInt(fechaActual.format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        // Establecer la fecha en el DTO
        pagoDto.setFechaUltimoAbono(fechaComoEntero);

        Pago pago = pm.toPago(pagoDto);
        return pm.toPagoDto(pr.save(pago));
    }

    @Override
    @Transactional(readOnly = true)

    public List<PagoDto> getListPagos() {
        return pr.findAll().stream()
                .map(pm::toPagoDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoDto> getPagosByAlquiler(Integer idAlquiler) {
        return pr.findAll().stream()
                .filter(pago -> pago.getAlquiler().getId().equals(idAlquiler))
                .map(pm::toPagoDto)
                .toList();
    }

    @Override
    public void deletePago(Integer pagoid) {
        Pago pago = pr.findById(pagoid)
                .orElseThrow(() -> new EntityNotFoundException("pago no encontrado por id: " + pagoid));
        pr.delete(pago);
    }

    @Override
    @Transactional
    public PagoDto updatePago(PagoDto pagoDto) {
        // Verificar que el pago existe
        Pago pagoExistente = pr.findById(pagoDto.getIdPago())
                .orElseThrow(() -> new EntityNotFoundException("Pago no encontrado por id: " + pagoDto.getIdPago()));

        // Actualizar la fecha automáticamente
        LocalDate fechaActual = LocalDate.now();
        Integer fechaComoEntero = Integer.parseInt(fechaActual.format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        // Actualizar los campos
        if (pagoDto.getValAbo() != null) {
            pagoExistente.setValorAbono(pagoDto.getValAbo());
        }
        pagoExistente.setFechaUltimoAbono(fechaComoEntero);
        
        // Si se proporciona un nuevo alquiler, actualizarlo
        if (pagoDto.getIdAlquiler() != null) {
            Integer alquilerActualId = pagoExistente.getAlquiler() != null ? pagoExistente.getAlquiler().getId() : null;
            if (!pagoDto.getIdAlquiler().equals(alquilerActualId)) {
                Alquiler nuevoAlquiler = ar.findById(pagoDto.getIdAlquiler())
                    .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado con ID: " + pagoDto.getIdAlquiler()));
                pagoExistente.setAlquiler(nuevoAlquiler);
            }
        }

        // Guardar los cambios
        Pago pagoActualizado = pr.save(pagoExistente);
        return pm.toPagoDto(pagoActualizado);
    }
}