package com.sga.project.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.dto.PagoDto;
import com.sga.project.mapper.AlquilerMapper;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;
import com.sga.project.models.Articulo;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.AlquilerArticuloRepository;
import com.sga.project.repositoryes.AlquilerRepositoryes;
import com.sga.project.repositoryes.ArticuloRepositoryes;
import com.sga.project.repositoryes.PagoRepositoryes;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class AlquilerServiceImplement implements AlquilerService {

    private final AlquilerMapper alquiMap;
    private final AlquilerRepositoryes alquiRepo;
    private final AlquilerArticuloRepository alquiArtiRepo;
    private final ArticuloRepositoryes articuloRepo;
    private final PagoRepositoryes pagoRepo;


    public AlquilerServiceImplement(AlquilerMapper alquiMap, AlquilerRepositoryes alquiRepo,
            AlquilerArticuloRepository alquiArtiRepo, ArticuloRepositoryes articuloRepo, 
            PagoRepositoryes pagoRepo) {

        this.alquiMap = alquiMap;
        this.alquiRepo = alquiRepo;
        this.alquiArtiRepo = alquiArtiRepo;
        this.articuloRepo = articuloRepo;
        this.pagoRepo = pagoRepo;
    }

    @Override
    @Transactional
    public AlquilerDto saveAlquiler(AlquilerDto alquilerDto) {
        // Convertir DTO a entidad
        Alquiler alquiler = alquiMap.toAlquiler(alquilerDto);


        // Calcular total antes de guardar (siempre inicializar en 0 si no hay
        // artículos)
        Integer total = 0;
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            total = alquilerDto.getArticulos().stream()
                    .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
                    .sum();
        }
        // Asegurar que el total nunca sea null
        alquiler.setTotalAlq(total != null ? total : 0);

        // Guardar el alquiler
        Alquiler alquiGuardado = alquiRepo.save(alquiler);

        // Guardar los artículos del alquiler si existen
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            for (AlquilerArticulosDto artDto : alquilerDto.getArticulos()) {
                Articulo articulo = articuloRepo.findById(artDto.getArticuloId())
                        .orElseThrow(
                                () -> new EntityNotFoundException("Artículo no encontrado: " + artDto.getArticuloId()));

                // Verificar si el artículo está disponible
                if (!articulo.getActivo()) {
                    throw new IllegalStateException("El artículo " + articulo.getNomArt() + " no está disponible para alquilar");
                }

                AlquilerArticulosId id = new AlquilerArticulosId(alquiGuardado.getId(), articulo.getId());
                AlquilerArticulos aa = new AlquilerArticulos();
                aa.setId(id);
                aa.setAlquiler(alquiGuardado);
                aa.setArticulo(articulo);
                aa.setPrecio(artDto.getPrecio());
                aa.setEstado(artDto.getEstado() != null ? artDto.getEstado() : false); // false = no devuelto
                aa.setEntregado(false); // Inicialmente no entregado
                aa.setObservaciones(artDto.getObservaciones());

                alquiArtiRepo.save(aa);

                // Marcar el artículo como no disponible
                articulo.setActivo(false);
                articuloRepo.save(articulo);
            }
        }

        
        // Guardar los pagos del alquiler si existen
        if (alquilerDto.getPagos() != null && !alquilerDto.getPagos().isEmpty()) {
            for (PagoDto pagoDto : alquilerDto.getPagos()) {
                Pago pago = new Pago();
                pago.setValorAbono(pagoDto.getValAbo());
                pago.setFechaUltimoAbono(pagoDto.getFechaUltimoAbono());
                pago.setAlquiler(alquiGuardado);
                
                pagoRepo.save(pago);
            }
        }
        
        // Recargar el alquiler para retornarlo
        Alquiler alquilerCompleto = alquiRepo.findById(alquiGuardado.getId())
                .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        return alquiMap.toAlquilerDto(alquilerCompleto);
    }

    @Override
    @Transactional
    public AlquilerDto getAlquilerById(Integer idAlquiler) {
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
                .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        return alquiMap.toAlquilerDto(alquiler);
    }

    @Override
    public void deleteAlquiler(Integer idAlquiler) {
        Alquiler alqui = alquiRepo.findById(idAlquiler)
                .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado por el ID: " + idAlquiler));
        alquiRepo.delete(alqui);
    }

    @Override
    @Transactional
    public AlquilerDto updateAlquiler(AlquilerDto alquiDto) {
        Alquiler alqui = alquiRepo.findById(alquiDto.getId_alquiler())
                .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        alqui.setFechaEnt(alquiDto.getFechaEntrega());
        alqui.setFechaRet(alquiDto.getFechaRetiro());

        Alquiler actualizado = alquiRepo.save(alqui);
        return alquiMap.toAlquilerDto(actualizado);
    }

    @Override
    @Transactional
    public List<AlquilerDto> getAlquilerList() {
        List<Alquiler> alquileres = alquiRepo.findAll();
        return alquileres.stream().map(alquiMap::toAlquilerDto).toList();
    }

    @Override
    @Transactional
    public void calcularTotalAlquiler(Integer idAlquiler) {
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(idAlquiler);
        // Usar el precio de la asignación (AlquilerArticulos.precio) en lugar del
        // precio del artículo
        Integer total = articulos.stream()
                .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
                .sum();

        Alquiler alquiler = alquiRepo.findById(idAlquiler)
                .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        alquiler.setTotalAlq(total);
        alquiRepo.save(alquiler);

    }

    @Override
    @Transactional
    public AlquilerDto toggleActivoAlquiler(Integer idAlquiler, Boolean activo) {
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado con ID: " + idAlquiler));
        
        alquiler.setActivo(activo);
        Alquiler alquilerActualizado = alquiRepo.save(alquiler);
        return alquiMap.toAlquilerDto(alquilerActualizado);
    }

    @Override
    @Transactional
    public void marcarArticulosComoEntregados(Integer idAlquiler) {
        // Verificar que el alquiler existe
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado con ID: " + idAlquiler));
        
        // Obtener todos los artículos del alquiler
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(idAlquiler);
        
        // Marcar todos como entregados
        for (AlquilerArticulos aa : articulos) {
            aa.setEntregado(true);
            alquiArtiRepo.save(aa);
        }
    }

    @Override
    @Transactional
    public void marcarArticulosComoDevueltos(Integer idAlquiler) {
        // Verificar que el alquiler existe
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado con ID: " + idAlquiler));
        
        // Obtener todos los artículos del alquiler
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(idAlquiler);
        
        // Marcar todos como devueltos y hacer artículos disponibles de nuevo
        for (AlquilerArticulos aa : articulos) {
            aa.setEstado(true); // true = devuelto
            alquiArtiRepo.save(aa);
            
            // Marcar el artículo como disponible nuevamente
            Articulo articulo = aa.getArticulo();
            articulo.setActivo(true);
            articuloRepo.save(articulo);
        }
    }

}
