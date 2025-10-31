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
class AlquilermapperImplement implements AlquilerMapper{

    private final ClientesRepository clienteRepo;
    private final AlquilerArticuloRepository alquilerArticuloRepo;
    private final PagoRepositoryes pagoRepo;

    public AlquilermapperImplement (ClientesRepository clienteRepo, AlquilerArticuloRepository alquilerArticuloRepo, PagoRepositoryes pagoRepo) {
        this.clienteRepo = clienteRepo;
        this.alquilerArticuloRepo = alquilerArticuloRepo;
        this.pagoRepo = pagoRepo;
    }

    @Override
    public Alquiler toAlquiler(AlquilerDto alquilerDto) {
        if (alquilerDto == null){
            return null;
        }
        Alquiler alquiler = new Alquiler();
        alquiler.setId(alquilerDto.getId_alquiler());
        alquiler.setFechaRet(alquilerDto.getFechaRetiro());
        alquiler.setFechaEnt(alquilerDto.getFechaEntrega());
        alquiler.setFechaAlq(alquilerDto.getFechaAlquiler());
        alquiler.setTotalAlq(alquilerDto.getTotalAlquiler());

        Clientes cliente = clienteRepo.findById(alquilerDto.getClienteDoc())
            .orElseThrow(()-> new EntityNotFoundException("Cliente no encontrado"));
        alquiler.setCliente(cliente);
        return alquiler;
    }

    @Override
    public AlquilerDto toAlquilerDto(Alquiler alquiler) {
        if (alquiler == null){
            return null;
        }

        // Obtener información del cliente antes de procesar artículos
        String nombreCliente = null;
        Long telCliente = null;
        try {
            if (alquiler.getCliente() != null) {
                nombreCliente = alquiler.getCliente().getNombre1() + " " + alquiler.getCliente().getApellido();
                telCliente = alquiler.getCliente().getNumTel();
            }
        } catch (Exception e) {
            // Si hay problema con el proxy, los valores quedarán null
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
                        dto.setPrecio(aa.getArticulo().getPrecio());
                    } else {
                        dto.setNomArticulo("Artículo " + aa.getId().getArticuloId());
                        dto.setPrecio(aa.getPrecio() != null ? aa.getPrecio() : 0);
                    }
                } catch (Exception e) {
                    // Si no se puede acceder al artículo, usar valores por defecto
                    dto.setNomArticulo("Artículo " + aa.getId().getArticuloId());
                    dto.setPrecio(aa.getPrecio() != null ? aa.getPrecio() : 0);
                }
                
                // Información del cliente (usando los valores que ya obtuvimos)
                dto.setNomCliente(nombreCliente);
                dto.setTelCliente(telCliente);
                
                // Información adicional del alquiler
                dto.setEstado(aa.getEstado());
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
        Integer clienteDoc = null;
        try {
            if (alquiler.getCliente() != null) {
                if (Hibernate.isInitialized(alquiler.getCliente())) {
                    clienteDoc = alquiler.getCliente().getDocCliente();
                } else {
                    // Forzar inicialización del proxy
                    Hibernate.initialize(alquiler.getCliente());
                    clienteDoc = alquiler.getCliente().getDocCliente();
                }
            }
        } catch (Exception e) {
            // Si falla la inicialización, intentar con el repositorio directamente
            // Buscar en los artículos si tienen información del cliente
            if (!articulosDto.isEmpty() && articulosDto.get(0).getNomCliente() != null) {
                // Ya tenemos información del cliente en los artículos
                clienteDoc = null; // Se mostrará el nombre del cliente desde los artículos
            }
        }
        
        // Cargar pagos del alquiler
        List<PagoDto> pagosDto = new ArrayList<>();
        try {
            List<Pago> pagos = pagoRepo.findByAlquilerId(alquiler.getId());
            for (Pago pago : pagos) {
                PagoDto dto = new PagoDto();
                dto.setIdPago(pago.getId_pago());
                dto.setValAbo(pago.getValorAbono());
                dto.setFechaUltimoAbono(pago.getFechaUltimoAbono());
                dto.setIdAlquiler(alquiler.getId());
                pagosDto.add(dto);
            }
        } catch (Exception e) {
            System.err.println("Error cargando pagos para alquiler " + alquiler.getId() + ": " + e.getMessage());
            pagosDto = new ArrayList<>();
        }

        // BACKEND: Calcular total pagado y saldo pendiente
        Integer totalPagado = pagosDto.stream()
            .mapToInt(p -> p.getValAbo() != null ? p.getValAbo() : 0)
            .sum();
        Integer saldoPendiente = (alquiler.getTotalAlq() != null ? alquiler.getTotalAlq() : 0) - totalPagado;
        
        // Crear el DTO con el orden correcto según la clase AlquilerDto:
        // Integer id_alquiler, Date fechaRetiro, Date fechaEntrega, Date fechaAlquiler, 
        // Integer totalAlquiler, Integer clienteDoc, List<AlquilerArticulosDto> articulos, 
        // List<PagoDto> pagos, Integer totalPagado, Integer saldoPendiente
        return new AlquilerDto(
            alquiler.getId(),           // id_alquiler
            alquiler.getFechaRet(),     // fechaRetiro
            alquiler.getFechaEnt(),     // fechaEntrega
            alquiler.getFechaAlq(),     // fechaAlquiler
            alquiler.getTotalAlq(),     // totalAlquiler
            clienteDoc,                 // clienteDoc
            articulosDto,               // articulos
            pagosDto,                   // pagos
            totalPagado,                // totalPagado (calculado)
            saldoPendiente              // saldoPendiente (calculado)
        );
    }
}


