package com.sga.project.mapper;

import com.sga.project.dto.PagoDto;
import com.sga.project.models.Pago;

public interface PagoMapper {
    Pago toPago (PagoDto pagoDto);
    PagoDto toPagoDto (Pago pago);
}
