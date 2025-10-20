package com.sga.project.service;

import java.util.List;
import com.sga.project.dto.AlquilerDto;

public interface AlquilerService {

public AlquilerDto getAlquilerById (Integer idAlquiler);
public AlquilerDto saveAlquiler (AlquilerDto alquilerDto);
public List <AlquilerDto> getAlquilerList ();
public void deleteAlquiler (Integer idAlquiler);
public AlquilerDto updateAlquiler (AlquilerDto alquilerDto);
}
