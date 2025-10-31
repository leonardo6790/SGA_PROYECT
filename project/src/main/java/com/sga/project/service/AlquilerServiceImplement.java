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
public class AlquilerServiceImplement implements AlquilerService{

    private final AlquilerMapper alquiMap;
    private final AlquilerRepositoryes alquiRepo;
    private final AlquilerArticuloRepository alquiArtiRepo;
    private final ArticuloRepositoryes articuloRepo;
    private final PagoRepositoryes pagoRepo;

    public AlquilerServiceImplement (AlquilerMapper alquiMap, AlquilerRepositoryes alquiRepo, AlquilerArticuloRepository alquiArtiRepo, ArticuloRepositoryes articuloRepo, PagoRepositoryes pagoRepo) 
        {
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
        
        // BACKEND: Calcular total del alquiler basado en los artículos
        Integer totalAlquiler = 0;
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            totalAlquiler = alquilerDto.getArticulos().stream()
                .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
                .sum();
        }
        alquiler.setTotalAlq(totalAlquiler);
        
        // BACKEND: Validar y calcular total de pagos
        Integer totalPagos = 0;
        if (alquilerDto.getPagos() != null && !alquilerDto.getPagos().isEmpty()) {
            totalPagos = alquilerDto.getPagos().stream()
                .mapToInt(p -> p.getValAbo() != null ? p.getValAbo() : 0)
                .sum();
            
            // VALIDACIÓN: Los pagos no pueden exceder el total del alquiler
            if (totalPagos > totalAlquiler) {
                throw new IllegalStateException(
                    String.format("El total de pagos ($%,d) excede el total del alquiler ($%,d)", 
                    totalPagos, totalAlquiler)
                );
            }
            
            // VALIDACIÓN: Los pagos deben ser positivos
            boolean hayPagoInvalido = alquilerDto.getPagos().stream()
                .anyMatch(p -> p.getValAbo() == null || p.getValAbo() <= 0);
            if (hayPagoInvalido) {
                throw new IllegalStateException("Todos los pagos deben tener un valor mayor a 0");
            }
        }
        
        // Calcular saldo pendiente
        Integer saldoPendiente = totalAlquiler - totalPagos;
        
        // Log para auditoría
        System.out.println("=== CREANDO ALQUILER ===");
        System.out.println("Total Alquiler: $" + String.format("%,d", totalAlquiler));
        System.out.println("Total Pagos: $" + String.format("%,d", totalPagos));
        System.out.println("Saldo Pendiente: $" + String.format("%,d", saldoPendiente));
        System.out.println("========================");
        
        // Guardar el alquiler
        Alquiler alquiGuardado = alquiRepo.save(alquiler);
        
        // Guardar los artículos del alquiler si existen
        if (alquilerDto.getArticulos() != null && !alquilerDto.getArticulos().isEmpty()) {
            for (AlquilerArticulosDto artDto : alquilerDto.getArticulos()) {
                Articulo articulo = articuloRepo.findById(artDto.getArticuloId())
                    .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado: " + artDto.getArticuloId()));
                
                AlquilerArticulosId id = new AlquilerArticulosId(alquiGuardado.getId(), articulo.getId());
                AlquilerArticulos aa = new AlquilerArticulos();
                aa.setId(id);
                aa.setAlquiler(alquiGuardado);
                aa.setArticulo(articulo);
                aa.setPrecio(artDto.getPrecio());
                aa.setEstado(artDto.getEstado() != null ? artDto.getEstado() : false);
                aa.setObservaciones(artDto.getObservaciones());
                
                alquiArtiRepo.save(aa);
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
    public AlquilerDto getAlquilerById (Integer idAlquiler) {
        Alquiler alquiler = alquiRepo.findById(idAlquiler)
            .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
        return alquiMap.toAlquilerDto(alquiler);
    }
    
    @Override
    public void deleteAlquiler (Integer idAlquiler) {
        Alquiler alqui = alquiRepo.findById(idAlquiler).orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado por el ID: " + idAlquiler));
        alquiRepo.delete(alqui);
    }

    @Override
    @Transactional
    public AlquilerDto updateAlquiler (AlquilerDto alquiDto) {
        Alquiler alqui = alquiRepo.findById(alquiDto.getId_alquiler())
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));
        
        alqui.setFechaEnt(alquiDto.getFechaEntrega());
        alqui.setFechaRet(alquiDto.getFechaRetiro());
        
        Alquiler actualizado = alquiRepo.save(alqui);
        return alquiMap.toAlquilerDto(actualizado);
    }

    @Override
    @Transactional
    public List<AlquilerDto> getAlquilerList () {
        List<Alquiler> alquileres = alquiRepo.findAll();
        return alquileres.stream().map(alquiMap::toAlquilerDto).toList();
    }

    @Override
    @Transactional
    public void calcularTotalAlquiler(Integer idAlquiler) {
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(idAlquiler);
        // Usar el precio de la asignación (AlquilerArticulos.precio) en lugar del precio del artículo
        Integer total = articulos.stream()
            .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
            .sum();

        Alquiler alquiler = alquiRepo.findById(idAlquiler)
        .orElseThrow(() -> new EntityNotFoundException("Alquiler no encontrado"));

        alquiler.setTotalAlq(total);
        alquiRepo.save(alquiler);

    }

}
