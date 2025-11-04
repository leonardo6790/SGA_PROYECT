package com.sga.project.service;

import java.util.List;

import com.sga.project.dto.TipoDocDto;

public interface TipoDocService {
    public TipoDocDto getTipoDoc(Integer id_tipoDoc);
    public TipoDocDto saveTipoDoc(TipoDocDto tipoDocDto);
    public List<TipoDocDto> getListTiposDocs();
    public void deleteTipoDoc(Integer id_tipoDoc);
    public TipoDocDto updateTipoDoc(TipoDocDto tipoDocDto);
}
