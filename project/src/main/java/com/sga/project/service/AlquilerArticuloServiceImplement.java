package com.sga.project.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.mapper.AlquilerArticuloMapper;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.AlquilerArticulosId;
import com.sga.project.repositoryes.AlquilerArticuloRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AlquilerArticuloServiceImplement implements AlquilerArticuloService {

    private final AlquilerArticuloRepository alquiArtiRepo;
    private final AlquilerArticuloMapper alquiArtiMap;
    private final AlquilerService alquiServi;
    private final PagoService pagoServi;

    public AlquilerArticuloServiceImplement(AlquilerArticuloRepository alquiArtiRepo,
            AlquilerArticuloMapper alquiArtiMap, AlquilerService alquiServi, PagoService pagoServi) {
        this.alquiArtiMap = alquiArtiMap;
        this.alquiArtiRepo = alquiArtiRepo;
        this.alquiServi = alquiServi;
        this.pagoServi = pagoServi;
    }

    @Override
    public AlquilerArticulosDto asignar(AlquilerArticulosDto alquiArtiDto) {
        AlquilerArticulos alqArt = alquiArtiMap.toAlquilerArticulos(alquiArtiDto);

        AlquilerArticulosId id = new AlquilerArticulosId(alquiArtiDto.getAlquilerId(), alquiArtiDto.getArticuloId());
        if (alquiArtiRepo.existsById(id)) {
            throw new IllegalStateException("Ya existe una asignación con ese alquiler y articulos");
        }

        AlquilerArticulos guardado = alquiArtiRepo.save(alqArt);
        alquiServi.calcularTotalAlquiler(alquiArtiDto.getAlquilerId());

        return alquiArtiMap.toAlquilerArticulosDto(guardado);
    }

    @Override
    public List<AlquilerArticulosDto> listarPorAlquiler(Integer alquilerId) {
        return alquiArtiRepo.findByAlquilerId(alquilerId)
                .stream()
                .map(alquiArtiMap::toAlquilerArticulosDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlquilerArticulosDto> listarPorArticulo(Integer ArticuloId) {
        return alquiArtiRepo.findByArticuloId(ArticuloId)
                .stream()
                .map(alquiArtiMap::toAlquilerArticulosDto)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarAsignacion(Integer articuloId, Integer alquilerId) {
        AlquilerArticulosId id = new AlquilerArticulosId(alquilerId, articuloId);
        if (!alquiArtiRepo.existsById(id)) {
            throw new EntityNotFoundException("Asignación no encontrada");
        }
        alquiArtiRepo.deleteById(id);
        // Recalcular el total del alquiler después de eliminar
        alquiServi.calcularTotalAlquiler(alquilerId);
    }

    @Override
    public AlquilerArticulosDto actualizarEstado(Integer articuloId, Integer alquilerId, Boolean estado, Boolean entregado) {
        AlquilerArticulosId id = new AlquilerArticulosId(alquilerId, articuloId);
        AlquilerArticulos alqArt = alquiArtiRepo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Asignación no encontrada"));
        
        // Validar que si se intenta marcar como entregado, el alquiler esté pagado en su totalidad
        if (entregado != null && entregado && (alqArt.getEntregado() == null || !alqArt.getEntregado())) {
            // Obtener el total del alquiler
            Integer totalAlquiler = alqArt.getAlquiler().getTotalAlq();
            
            // Calcular el total pagado usando PagoService
            List<com.sga.project.dto.PagoDto> pagos = pagoServi.getPagosByAlquiler(alquilerId);
            Integer totalPagado = 0;
            if (pagos != null && !pagos.isEmpty()) {
                totalPagado = pagos.stream()
                    .map(pago -> pago.getValAbo() != null ? pago.getValAbo() : 0)
                    .reduce(0, Integer::sum);
            }
            
            // Si el total pagado es menor al total del alquiler, lanzar excepción
            if (totalPagado < totalAlquiler) {
                Integer saldoPendiente = totalAlquiler - totalPagado;
                throw new IllegalStateException(
                    "No se puede entregar este artículo. El alquiler tiene un saldo pendiente de $" + saldoPendiente + 
                    ". Total a pagar: $" + totalAlquiler + ", Total pagado: $" + totalPagado
                );
            }
        }
        
        if (estado != null) {
            alqArt.setEstado(estado);
        }
        if (entregado != null) {
            alqArt.setEntregado(entregado);
        }
        
        AlquilerArticulos actualizado = alquiArtiRepo.save(alqArt);
        return alquiArtiMap.toAlquilerArticulosDto(actualizado);
    }

    @Override
    public List<AlquilerArticulosDto> listarAlquileres() {
        return alquiArtiRepo.findAll().stream().map(alquiArtiMap::toAlquilerArticulosDto).toList();
    }

    @Override
    public String debugAlquiler(Integer alquilerId) {
        List<AlquilerArticulos> articulos = alquiArtiRepo.findByAlquilerId(alquilerId);
        StringBuilder debug = new StringBuilder();
        debug.append("=== DEBUG ALQUILER ID: ").append(alquilerId).append(" ===\n\n");
        debug.append("Total de artículos asignados: ").append(articulos.size()).append("\n\n");

        int sumaTotal = 0;
        for (AlquilerArticulos aa : articulos) {
            debug.append("Artículo ID: ").append(aa.getArticulo().getId()).append("\n");
            debug.append("  - Nombre: ").append(aa.getArticulo().getNomArt()).append("\n");
            debug.append("  - Precio del artículo (tabla articulos): ").append(aa.getArticulo().getPrecio())
                    .append("\n");
            debug.append("  - Precio en asignación (tabla alquiler_articulos): ").append(aa.getPrecio()).append("\n");
            debug.append("  - Estado: ").append(aa.getEstado()).append("\n");
            debug.append("  - Observaciones: ").append(aa.getObservaciones()).append("\n\n");

            Integer precioAsignacion = aa.getPrecio() != null ? aa.getPrecio() : 0;
            sumaTotal += precioAsignacion;
        }

        debug.append("SUMA TOTAL CALCULADA: ").append(sumaTotal).append("\n");

        return debug.toString();
    }
}
