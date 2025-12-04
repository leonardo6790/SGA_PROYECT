package com.sga.project.controller;

import java.util.List;
import java.util.Map;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.sga.project.dto.ArticuloDto;
import com.sga.project.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping ("/api/articulos")
public class ArticuloController {

    private final ArticuloService artiServi;

    public ArticuloController (ArticuloService artiServi) {
        this.artiServi = artiServi;
    }

    //Crear artículo
    @PostMapping("/Crear")
    public ResponseEntity <?> crear (@Valid @RequestBody ArticuloDto articuloDto){
        try {
            ArticuloDto crearlo = artiServi.saveArticulo(articuloDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Articulo creado con exito", "data", crearlo));
        } catch (IllegalStateException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", exception.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear el articulo", "detalle", ex.getMessage()));
        }
    };

    //Crear artículo con foto
    @PostMapping("/CrearConFoto")
    public ResponseEntity<?> crearConFoto(
            @RequestParam("nombre") String nombre,
            @RequestParam("idCategoria") Integer idCategoria,
            @RequestParam("precioArt") Integer precioArt,
            @RequestParam(value = "generoArt", required = false) String generoArt,
            @RequestParam(value = "tallaArt", required = false) String tallaArt,
            @RequestParam(value = "colorArt", required = false) String colorArt,
            @RequestParam("fotoArt") MultipartFile fotoArt) {
        try {
            System.out.println("=== CREANDO ARTÍCULO CON FOTO ===");
            System.out.println("Nombre archivo recibido: " + fotoArt.getOriginalFilename());
            System.out.println("Tamaño archivo: " + fotoArt.getSize() + " bytes");
            System.out.println("Content-Type: " + fotoArt.getContentType());
            
            // Validar que la foto no esté vacía
            if (fotoArt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "La foto es requerida"));
            }

            // Guardar la foto y obtener la URL
            String fotoUrl = guardarImagen(fotoArt);
            System.out.println("URL generada: " + fotoUrl);

            // Crear el DTO del artículo
            ArticuloDto articuloDto = new ArticuloDto();
            articuloDto.setNombre(nombre);
            articuloDto.setIdCategoria(idCategoria);
            articuloDto.setPrecioArt(precioArt);
            articuloDto.setGeneroArt(generoArt);
            articuloDto.setTallaArt(tallaArt);
            articuloDto.setColorArt(colorArt);
            articuloDto.setFotoArt(fotoUrl);
            articuloDto.setActivo(true);

            // Guardar el artículo
            ArticuloDto crearlo = artiServi.saveArticulo(articuloDto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Articulo creado con exito", "data", crearlo));
        } catch (IllegalStateException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", exception.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear el articulo", "detalle", ex.getMessage()));
        }
    }

    //Método auxiliar para guardar la imagen
    private String guardarImagen(MultipartFile archivo) throws IOException {
        // Obtener directorio del usuario (compatible con dev y producción)
        String userHome = System.getProperty("user.home");
        String directorioUpload = userHome + File.separator + "AppData" + File.separator + "SGA" + File.separator + "uploads" + File.separator + "articulos";
        
        // Crear directorio si no existe
        File directorio = new File(directorioUpload);
        if (!directorio.exists()) {
            directorio.mkdirs();
            System.out.println("Directorio creado: " + directorioUpload);
        }

        // Generar nombre único para el archivo
        String nombreOriginal = archivo.getOriginalFilename();
        if (nombreOriginal == null || nombreOriginal.isEmpty()) {
            throw new IOException("El nombre del archivo no es válido");
        }
        
        String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        String nombreUnico = System.currentTimeMillis() + extension;

        // Guardar archivo
        File archivo_guardado = new File(directorioUpload + File.separator + nombreUnico);
        archivo.transferTo(archivo_guardado);
        
        System.out.println("Archivo guardado en: " + archivo_guardado.getAbsolutePath());
        System.out.println("Archivo existe: " + archivo_guardado.exists());

        // Retornar URL relativa
        String urlRetorno = "/uploads/articulos/" + nombreUnico;
        System.out.println("URL retornada: " + urlRetorno);
        return urlRetorno;
    }

    @GetMapping
    public ResponseEntity<List<ArticuloDto>> listarArticulos() {
        List<ArticuloDto> articulos = artiServi.getListArticulos();
        return ResponseEntity.ok(articulos);
    };

    @DeleteMapping("/Eliminar/{id}")
    public ResponseEntity<Void> eliminarArt (@PathVariable Integer id) {
    artiServi.deleteArticulo(id);
    return ResponseEntity.noContent().build();
    };
    
    @GetMapping("ConsultarById/{id}")
    public ResponseEntity <ArticuloDto> buscarPorId(@PathVariable Integer id) {
        ArticuloDto artiDto = artiServi.getArticuloById(id);
        return ResponseEntity.ok(artiDto);
    }

    @PutMapping("Actualizar/{id}")
    public ResponseEntity<ArticuloDto> actualizarArticulo (@PathVariable Integer id, @Valid @RequestBody ArticuloDto artiDto) {
        artiDto.setIdArt(id);
        ArticuloDto artiActualizado = artiServi.updateArticulo(artiDto);
        return ResponseEntity.ok(artiActualizado);
    }

    @PutMapping(value = "ActualizarConFoto/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizarArticuloConFoto(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("generoArt") String generoArt,
            @RequestParam("tallaArt") String tallaArt,
            @RequestParam("colorArt") String colorArt,
            @RequestParam("precioArt") Integer precioArt,
            @RequestParam("idCategoria") Integer idCategoria,
            @RequestParam(value = "fotoArt", required = false) MultipartFile fotoArt) {
        try {
            // Buscar artículo existente
            ArticuloDto articuloExistente = artiServi.getArticuloById(id);
            
            // Actualizar campos
            articuloExistente.setNombre(nombre);
            articuloExistente.setGeneroArt(generoArt);
            articuloExistente.setTallaArt(tallaArt);
            articuloExistente.setColorArt(colorArt);
            articuloExistente.setPrecioArt(precioArt);
            articuloExistente.setIdCategoria(idCategoria);
            
            // Si hay nueva foto, guardarla
            if (fotoArt != null && !fotoArt.isEmpty()) {
                String urlFoto = guardarImagen(fotoArt);
                articuloExistente.setFotoArt(urlFoto);
            }
            
            // Actualizar artículo
            ArticuloDto articuloActualizado = artiServi.updateArticulo(articuloExistente);
            
            return ResponseEntity.ok(Map.of(
                "mensaje", "Artículo actualizado exitosamente",
                "data", articuloActualizado
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al actualizar artículo", "detalle", ex.getMessage()));
        }
    }


    @GetMapping ("ConsultarByName/{nomArt}")
    public ResponseEntity<List<ArticuloDto>> buscarPorNombre (@PathVariable String nomArt) {
        List<ArticuloDto> articulos = artiServi.getArticulosByName(nomArt);
        return ResponseEntity.ok(articulos);
    }
    
    @GetMapping ("ConsultarByCate/{nomCate}")
    public ResponseEntity<List<ArticuloDto>> buscaPorCate (@PathVariable String nomCate) {
        List<ArticuloDto> articulosCate = artiServi.getArticulosByCate(nomCate);
        return ResponseEntity.ok(articulosCate);
    }

    @PutMapping("activar/{id}")
    public ResponseEntity<ArticuloDto> activarArticulo(@PathVariable Integer id) {
        ArticuloDto articuloActualizado = artiServi.toggleActivoArticulo(id, true);
        return ResponseEntity.ok(articuloActualizado);
    }

    @PutMapping("desactivar/{id}")
    public ResponseEntity<ArticuloDto> desactivarArticulo(@PathVariable Integer id) {
        ArticuloDto articuloActualizado = artiServi.toggleActivoArticulo(id, false);
        return ResponseEntity.ok(articuloActualizado);
    }

    @GetMapping("verificarDisponibilidad/{id}")
    public ResponseEntity<?> verificarDisponibilidad(
            @PathVariable Integer id,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        try {
            boolean disponible = artiServi.verificarDisponibilidadPorFechas(id, fechaInicio, fechaFin);
            return ResponseEntity.ok(Map.of("disponible", disponible));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al verificar disponibilidad", "detalle", ex.getMessage()));
        }
    }
}