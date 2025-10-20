package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.PagoDto;

public interface PagoService {
public PagoDto getPagoById (Integer idPago);
public PagoDto savePago (PagoDto pagoDto);
public List<PagoDto> getListPagos ();
public void deletePago(Integer idPago);
}
