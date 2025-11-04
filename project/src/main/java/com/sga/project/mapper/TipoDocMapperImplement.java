package com.sga.project.mapper;

import org.springframework.stereotype.Component;

import com.sga.project.dto.TipoDocDto;
import com.sga.project.models.TipoDoc;

@Component
public class TipoDocMapperImplement implements TipoDocMapper {

    public TipoDocMapperImplement() {
    }

    @Override
    public TipoDoc toTipoDoc(TipoDocDto tipoDocDto) {
        if (tipoDocDto == null) {
            return null;
        }
        TipoDoc tipoDoc = new TipoDoc();
        tipoDoc.setId_tipoDoc(tipoDocDto.getIdTipoDoc());
        tipoDoc.setNomDoc(tipoDocDto.getNomDoc());
        tipoDoc.setActivo(tipoDocDto.getActivo() != null ? tipoDocDto.getActivo() : true);
        return tipoDoc;
    }

    @Override
    public TipoDocDto toTipoDocDto(TipoDoc tipoDoc) {
        if (tipoDoc == null) {
            return null;
        }

        return new TipoDocDto(
            tipoDoc.getId_tipoDoc(),
            tipoDoc.getNomDoc(),
            tipoDoc.getActivo()
        );
    }
}
