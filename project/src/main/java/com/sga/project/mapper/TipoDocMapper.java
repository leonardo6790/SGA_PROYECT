package com.sga.project.mapper;

import com.sga.project.dto.TipoDocDto;
import com.sga.project.models.TipoDoc;

public interface TipoDocMapper {

    TipoDoc toTipoDoc(TipoDocDto tipoDocDto);
    TipoDocDto toTipoDocDto(TipoDoc tipoDoc);

}
