package com.sga.project.mapper;

import org.springframework.stereotype.Component;
import com.sga.project.dto.PagoDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.AlquilerRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Component class PagoMapperImplement implements PagoMapper {

    private final AlquilerRepositoryes alquiRepo;

    public PagoMapperImplement (AlquilerRepositoryes alquiRepo) {
        this.alquiRepo = alquiRepo;
    }

    @Override
    public Pago toPago(PagoDto pagoDto) {
    if (pagoDto == null){
    return null;
        
    }
    Pago pago = new Pago();
    pago.setId_pago(pagoDto.getIdPago());
    pago.setFechaUltimoAbono(pagoDto.getFechaUltimoAbono());
    pago.setValorAbono(pagoDto.getValAbo());

    Alquiler alqui = alquiRepo.findById(pagoDto.getIdAlquiler())
    .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
    pago.setAlquiler(alqui);

    return pago;
    }

    @Override
    public PagoDto toPagoDto(Pago pago) {
    if (pago == null) {
        return null;
        
    }
    return new PagoDto(
        pago.getId_pago(),
        pago.getFechaUltimoAbono(),
        pago.getValorAbono(),
        pago.getAlquiler() != null ? pago.getAlquiler().getId() : null
    );
}

}
