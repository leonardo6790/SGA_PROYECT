package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.AlquilerArticulosDto;


public interface AlquilerArticuloService {

    AlquilerArticulosDto asignar(AlquilerArticulosDto alquiArtiDto);

    List<AlquilerArticulosDto> listarPorAlquiler (Integer alquilerId);

    List<AlquilerArticulosDto> listarPorArticulo (Integer articuloId);

    void eliminarAsignacion (Integer ArticuloId, Integer alquilerId);

    List<AlquilerArticulosDto> listarAlquileres ();
}
