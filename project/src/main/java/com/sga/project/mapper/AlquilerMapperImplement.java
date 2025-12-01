package com.sga.project.mapper;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

import com.sga.project.dto.AlquilerArticulosDto;
import com.sga.project.dto.AlquilerDto;
import com.sga.project.dto.PagoDto;
import com.sga.project.models.Alquiler;
import com.sga.project.models.AlquilerArticulos;
import com.sga.project.models.Clientes;
import com.sga.project.models.Pago;
import com.sga.project.repositoryes.AlquilerArticuloRepository;
import com.sga.project.repositoryes.ClientesRepository;
import com.sga.project.repositoryes.PagoRepositoryes;

import jakarta.persistence.EntityNotFoundException;

@Component
class AlquilermapperImplement implements AlquilerMapper {

    private final ClientesRepository clienteRepo;
    private final AlquilerArticuloRepository alquilerArticuloRepo;
    private final PagoRepositoryes pagoRepo;

    public AlquilermapperImplement(ClientesRepository clienteRepo, 
            AlquilerArticuloRepository alquilerArticuloRepo, 
            PagoRepositoryes pagoRepo) {
        this.clienteRepo = clienteRepo;
        this.alquilerArticuloRepo = alquilerArticuloRepo;
        this.pagoRepo = pagoRepo;
    }

    @Override
    public Alquiler toAlquiler(AlquilerDto alquilerDto) {
        if (alquilerDto == null) {
            return null;
        }
        Alquiler alquiler = new Alquiler();
        alquiler.setId(alquilerDto.getId_alquiler());
        alquiler.setFechaRet(alquilerDto.getFechaRetiro());
        alquiler.setFechaEnt(alquilerDto.getFechaEntrega());
        alquiler.setFechaAlq(alquilerDto.getFechaAlquiler());
        alquiler.setTotalAlq(alquilerDto.getTotalAlquiler());
        alquiler.setActivo(alquilerDto.getActivo() != null ? alquilerDto.getActivo() : true);

        Clientes cliente = clienteRepo.findById(alquilerDto.getClienteDoc())
                .orElseThrow(() -> new EntityNotFoundException("Cliente no encontrado"));
        alquiler.setCliente(cliente);
        return alquiler;
    }

    @Override
    public AlquilerDto toAlquilerDto(Alquiler alquiler) {
        if (alquiler == null) {
            return null;
        }

        // Obtener información del cliente antes de procesar artículos
        String nombreCliente = null;
        Long telCliente = null;
        Integer clienteDoc = null;
        try {
            if (alquiler.getCliente() != null) {
                Hibernate.initialize(alquiler.getCliente()); // Forzar inicialización
                nombreCliente = (alquiler.getCliente().getNombre1() != null ? alquiler.getCliente().getNombre1() : "") + 
                               " " + 
                               (alquiler.getCliente().getApellido() != null ? alquiler.getCliente().getApellido() : "");
                nombreCliente = nombreCliente.trim();
                if (nombreCliente.isEmpty()) {
                    nombreCliente = "Cliente #" + alquiler.getCliente().getDocCliente();
                }
                telCliente = alquiler.getCliente().getNumTel();
                clienteDoc = alquiler.getCliente().getDocCliente();
            }
        } catch (Exception e) {
            System.err.println("Error al cargar información del cliente: " + e.getMessage());
            nombreCliente = clienteDoc != null ? "Cliente #" + clienteDoc : "Cliente no disponible";
        }

        // Cargar artículos directamente desde el repositorio
        List<AlquilerArticulosDto> articulosDto = new ArrayList<>();
        try {
            List<AlquilerArticulos> articulos = alquilerArticuloRepo.findByAlquilerId(alquiler.getId());
            for (AlquilerArticulos aa : articulos) {
                AlquilerArticulosDto dto = new AlquilerArticulosDto();
                dto.setAlquilerId(alquiler.getId());
                dto.setArticuloId(aa.getId().getArticuloId());

                // Información del artículo
                try {
                    if (aa.getArticulo() != null) {
                        dto.setNomArticulo(aa.getArticulo().getNomArt());
                        dto.setTallaArticulo(aa.getArticulo().getTalla());
                    } else {
                        dto.setNomArticulo("Artículo " + aa.getId().getArticuloId());
                    }
                } catch (Exception e) {
                    // Si no se puede acceder al artículo, usar valores por defecto
                    dto.setNomArticulo("Artículo " + aa.getId().getArticuloId());
                }

                // El precio SIEMPRE debe venir de la tabla alquiler_articulos, no del artículo
                dto.setPrecio(aa.getPrecio() != null ? aa.getPrecio() : 0);

                // Información del cliente (usando los valores que ya obtuvimos)
                dto.setNomCliente(nombreCliente);
                dto.setTelCliente(telCliente);

                // Información adicional del alquiler
                dto.setEstado(aa.getEstado());
                dto.setEntregado(aa.getEntregado()); // IMPORTANTE: Asignar el campo entregado
                dto.setObservaciones(aa.getObservaciones());
                dto.setFechaEntrega(alquiler.getFechaEnt());

                articulosDto.add(dto);
            }
        } catch (Exception e) {
            // Si hay error, dejar lista vacía pero imprimir error para debug
            System.err.println("Error cargando artículos para alquiler " + alquiler.getId() + ": " + e.getMessage());
            articulosDto = new ArrayList<>();
        }

        // Cargar información del cliente de forma segura
        try {
            if (alquiler.getCliente() != null && clienteDoc == null) {
                if (Hibernate.isInitialized(alquiler.getCliente())) {
                    clienteDoc = alquiler.getCliente().getDocCliente();
                } else {
                    // Forzar inicialización del proxy
                    Hibernate.initialize(alquiler.getCliente());
                    clienteDoc = alquiler.getCliente().getDocCliente();
                }
            }
        } catch (Exception e) {
            System.err.println("Error al cargar documento del cliente: " + e.getMessage());
        }


        // Calcular el total sumando los precios de los artículos cargados
        Integer totalCalculado = articulosDto.stream()
                .mapToInt(a -> a.getPrecio() != null ? a.getPrecio() : 0)
                .sum();

        // Cargar los pagos del alquiler
        List<Pago> pagos = pagoRepo.findByAlquilerId(alquiler.getId());
        List<PagoDto> pagosDto = pagos.stream()
                .map(p -> new PagoDto(p.getId_pago(), p.getFechaUltimoAbono(), p.getValorAbono(), p.getAlquiler().getId()))
                .toList();

        // Calcular total pagado y saldo pendiente
        Integer totalPagado = pagosDto.stream()
                .mapToInt(p -> p.getValAbo() != null ? p.getValAbo() : 0)
                .sum();
        Integer saldoPendiente = totalCalculado - totalPagado;

        // Crear el DTO con todos los campos requeridos
        return new AlquilerDto(
                alquiler.getId(), // id_alquiler
                alquiler.getFechaRet(), // fechaRetiro
                alquiler.getFechaEnt(), // fechaEntrega
                alquiler.getFechaAlq(), // fechaAlquiler
                totalCalculado, // totalAlquiler
                clienteDoc, // clienteDoc
                alquiler.getActivo(), // activo
                articulosDto, // articulos
                pagosDto, // pagos
                totalPagado, // totalPagado
                saldoPendiente // saldoPendiente
        );
    }
}
