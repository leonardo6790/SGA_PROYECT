package com.sga.project.mapper;

import org.springframework.stereotype.Component;
import com.sga.project.dto.PagoDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.AlquilerRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Component 
@SuppressWarnings("null")
class PagoMapperImplement implements PagoMapper {

    private final AlquilerRepositoryes alquiRepo;
    private final AlquilerMapper alquilerMapper;

    public PagoMapperImplement (AlquilerRepositoryes alquiRepo, AlquilerMapper alquilerMapper) {
        this.alquiRepo = alquiRepo;
        this.alquilerMapper = alquilerMapper;
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

    if (pagoDto.getIdAlquiler() != null) {
        Integer idAlquiler = pagoDto.getIdAlquiler();
        Alquiler alqui = alquiRepo.findById(idAlquiler)
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        pago.setAlquiler(alqui);
    }

    return pago;
    }

    @Override
    public PagoDto toPagoDto(Pago pago) {
    if (pago == null) {
        return null;
        
    }
    PagoDto pagoDto = new PagoDto();
    pagoDto.setIdPago(pago.getId_pago());
    pagoDto.setFechaUltimoAbono(pago.getFechaUltimoAbono());
    pagoDto.setValAbo(pago.getValorAbono());
    pagoDto.setIdAlquiler(pago.getAlquiler() != null ? pago.getAlquiler().getId() : null);
    
    // Incluir el objeto completo del alquiler
    if (pago.getAlquiler() != null) {
        pagoDto.setAlquiler(alquilerMapper.toAlquilerDto(pago.getAlquiler()));
    }
    
    return pagoDto;
}

}
