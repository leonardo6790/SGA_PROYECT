package com.sga.project.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.PagoDto;
import com.sga.project.mapper.PagoMapper;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.PagoRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PagoServiceImplement implements PagoService {

    private final PagoRepositoryes pr;
    private final PagoMapper pm;

    public PagoServiceImplement (PagoRepositoryes pr, PagoMapper pm) {
        this.pm = pm;
        this.pr = pr;
    }

    @Override
    @Transactional (readOnly = true)
    public PagoDto getPagoById(Integer idPago) {
    Pago pago = pr.findById(idPago).get();
    return pm.toPagoDto(pago);
    }

    @Override
    @Transactional
    public PagoDto savePago(PagoDto pagoDto) {
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
    public void deletePago(Integer pagoid) {
    Pago pago = pr.findById(pagoid).orElseThrow(() -> new EntityNotFoundException("pago no encontrado por id: "+ pagoid));
    pr.delete(pago);
    } 
}