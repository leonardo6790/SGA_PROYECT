package com.sga.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sga.project.dto.TipoDocDto;
import com.sga.project.mapper.TipoDocMapper;
import com.sga.project.models.TipoDoc;
import com.sga.project.repositoryes.TipoDocRepositoryes;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@SuppressWarnings("null")
public class TipoDocServiceImplement implements TipoDocService {

    private final TipoDocMapper tipoDocMapper;
    private final TipoDocRepositoryes tipoDocRepository;

    public TipoDocServiceImplement(TipoDocMapper tipoDocMapper, TipoDocRepositoryes tipoDocRepository) {
        this.tipoDocMapper = tipoDocMapper;
        this.tipoDocRepository = tipoDocRepository;
    }

    @Override
    public TipoDocDto getTipoDoc(Integer id_tipoDoc) {
        return tipoDocRepository.findById(id_tipoDoc)
            .map(tipoDocMapper::toTipoDocDto)
            .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado por id:" + id_tipoDoc));
    }

    @Override
    @Transactional
    public TipoDocDto saveTipoDoc(TipoDocDto tipoDocDto) {
        TipoDoc tipoDoc = tipoDocMapper.toTipoDoc(tipoDocDto);
        TipoDoc tipoDocGuardado = tipoDocRepository.save(tipoDoc);
        return tipoDocMapper.toTipoDocDto(tipoDocGuardado);
    }

    @Override
    @Transactional
    public List<TipoDocDto> getListTiposDocs() {
        return tipoDocRepository.findAll().stream()
            .map(tipoDocMapper::toTipoDocDto)
            .toList();
    }

    @Override
    @Transactional
    public void deleteTipoDoc(Integer id_tipoDoc) {
        TipoDoc tipoDoc = tipoDocRepository.findById(id_tipoDoc)
            .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado por id: " + id_tipoDoc));
        tipoDocRepository.delete(tipoDoc);
    }

    @Override
    @Transactional
    public TipoDocDto updateTipoDoc(TipoDocDto tipoDocDto) {
        TipoDoc tipoDoc = tipoDocRepository.findById(tipoDocDto.getIdTipoDoc())
            .orElseThrow(() -> new EntityNotFoundException("Tipo de documento no encontrado"));

        tipoDoc.setNomDoc(tipoDocDto.getNomDoc());
        TipoDoc tipoDocActualizado = tipoDocRepository.save(tipoDoc);
        return tipoDocMapper.toTipoDocDto(tipoDocActualizado);
    }
}
