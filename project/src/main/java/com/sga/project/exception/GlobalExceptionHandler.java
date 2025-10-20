// package com.sga.project.exception;

// import java.time.LocalDateTime;
// import java.util.Map;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// import jakarta.persistence.EntityNotFoundException;

// @RestControllerAdvice
// public class GlobalExceptionHandler {
// @ExceptionHandler(EntityNotFoundException.class)
//     public ResponseEntity<Map<String, Object>> manejarNoEncontrado(EntityNotFoundException ex) {
//         return ResponseEntity.status(HttpStatus.NOT_FOUND)
//         .body(Map.of(
//             "error", ex.getMessage(),
//             "codigo", 404,
//             "timestamp", LocalDateTime.now()
//         ));
//     }
//     @ExceptionHandler(IllegalStateException.class)
//     public ResponseEntity<Map<String, Object>> manejarArgumentoInvalido(IllegalStateException ex){
//         return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//         .body(Map.of(
//             "error", ex.getMessage(),
//             "codigo", 400,
//             "timestamp", LocalDateTime.now()
//         ));
//     }
//     @ExceptionHandler(IllegalStateException.class)
//     public ResponseEntity<Map<String, Object>> manejarEstadoIlegal(IllegalStateException ex){
//         return ResponseEntity.status(HttpStatus.CONFLICT)
//         .body(Map.of(
//             "error", ex.getMessage(),
//             "codigo", 409,
//             "timestamp", LocalDateTime.now()
//         ));
//     }
// }
