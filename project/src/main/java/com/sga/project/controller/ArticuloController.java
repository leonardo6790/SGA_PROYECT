package com.sga.project.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sga.project.dto.ArticuloDto;
import com.sga.project.dto.ArticuloUpdateDto;
import com.sga.project.service.ArticuloService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;




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
    public ResponseEntity<ArticuloDto> actualizarArticulo (@PathVariable Integer id, @Valid @RequestBody ArticuloUpdateDto artiUpDto) {
        artiUpDto.setIdArt(id);
        ArticuloDto artiActualizado = artiServi.updateArticulo(artiUpDto);
        return ResponseEntity.ok(artiActualizado);
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
}