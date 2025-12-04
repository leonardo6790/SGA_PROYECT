# Reporte de Debugging - Creación de Vendedor (Error 400)

## Problema Identificado

El formulario de creación de vendedor estaba retornando **Error 400 (Bad Request)** del backend sin un mensaje de error específico que ayudara a diagnosticar el problema.

## Investigación Realizada

### 1. Análisis del Backend
- ✅ `UsuarioController.java`: Valida que `idRol`, `idBarrio`, e `idTipoDoc` no sean nulos
- ✅ `UsuarioMapper.java`: Carga las entidades relacionadas (Barrio, TipoDoc, Rol) por ID
- ✅ `UsuarioDto.java`: Define correctamente los tipos de datos
- ✅ Field `tele` es `Long` (correcto para números telefónicos grandes)

### 2. Análisis del Frontend
Se encontraron dos problemas principales:

#### Problema A: Nombres de campos incorrectos en el mapeo de DTOs
**El Problema:**
- El backend devuelve DTOs con campos en camelCase: `idTipoDoc`, `idBarrio`, `nombreBarrio`
- El mapper convierte de snake_case en entidades a camelCase en DTOs
- El frontend intentaba acceder a `tipo.id_tipoDoc` (snake_case) cuando debería ser `tipo.idTipoDoc` (camelCase)

**Línea de Código Problemática:**
```javascript
// ANTES (incorrecto)
{tiposDoc.map(tipo => (
  <option key={tipo.id_tipoDoc} value={tipo.id_tipoDoc}>
```

**Corrección Aplicada:**
```javascript
// DESPUÉS (correcto)
{tiposDoc.map(tipo => (
  <option key={tipo.idTipoDoc} value={tipo.idTipoDoc}>
```

#### Problema B: Falta de validación y error handling
**El Problema:**
- El método `crearUsuario()` en `usuariosApi.js` lanzaba un error genérico sin mostrar el mensaje específico del servidor
- Falta validación de que `idBarrio` e `idTipoDoc` sean números válidos después de `parseInt()`

**Correcciones Aplicadas:**

1. **En `usuariosApi.js`:**
```javascript
// ANTES
if (!res.ok) throw new Error("No se pudo crear el usuario");

// DESPUÉS
const responseData = await res.json();
if (!res.ok) {
    console.error("Error del servidor:", responseData);
    throw new Error(responseData.error || "No se pudo crear el usuario");
}
```

2. **En `reports.component.jsx` - Validación adicional:**
```javascript
// Agregar validación después de parseInt()
if (isNaN(vendedorData.idBarrio) || vendedorData.idBarrio <= 0) {
    throw new Error("El barrio seleccionado no es válido");
}

if (isNaN(vendedorData.idTipoDoc) || vendedorData.idTipoDoc <= 0) {
    throw new Error("El tipo de documento seleccionado no es válido");
}
```

## Cambios Implementados

### Archivo 1: `FRONT/src/api/usuariosApi.js`

**Función modificada:** `crearUsuario()`

```javascript
export const crearUsuario = async (data) => {
    const res = await fetch(`${BASE_URL}/crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
        console.error("Error del servidor:", responseData);
        throw new Error(responseData.error || "No se pudo crear el usuario");
    }
    
    return responseData;
};
```

### Archivo 2: `FRONT/src/pages/Seller_view/Reports/reports.component.jsx`

**Cambios en la sección de mapeo de tipos de documento:**
```javascript
// Cambié de:
{tiposDoc.map(tipo => (
  <option key={tipo.id_tipoDoc} value={tipo.id_tipoDoc}>

// A:
{tiposDoc.map(tipo => (
  <option key={tipo.idTipoDoc} value={tipo.idTipoDoc}>
```

**Cambios en la función `handleCreateVendedor()`:**

1. Agregué validación de los campos convertidos:
```javascript
// Validar que los IDs se convirtieron correctamente a números
if (isNaN(vendedorData.idBarrio) || vendedorData.idBarrio <= 0) {
    throw new Error("El barrio seleccionado no es válido");
}

if (isNaN(vendedorData.idTipoDoc) || vendedorData.idTipoDoc <= 0) {
    throw new Error("El tipo de documento seleccionado no es válido");
}
```

2. Mejoré el logging:
```javascript
console.log("Tipo de datos:", {
    numDocumento: typeof vendedorData.numDocumento,
    tele: typeof vendedorData.tele,
    idBarrio: typeof vendedorData.idBarrio,
    idTipoDoc: typeof vendedorData.idTipoDoc,
    idRol: typeof vendedorData.idRol
});
```

3. Mejoré el manejo de errores:
```javascript
catch (error) {
    console.error("Error al crear vendedor:", error);
    const errorMsg = error.message || "Error desconocido";
    alert(`Error al crear el vendedor: ${errorMsg}`);
}
```

## Estructura de Datos Confirmada

### Frontend envía a Backend:
```json
{
  "numDocumento": 1234567890,        // Integer
  "nombre1": "Juan",                  // String
  "nombre2": null,                    // String | null (opcional)
  "apellido1": "Pérez",               // String
  "apellido2": null,                  // String | null (opcional)
  "dire": null,                       // String | null (opcional)
  "tele": 3001234567,                 // Long (número telefónico)
  "correoElectronico": "email@...",  // String
  "contra": "password",               // String
  "activo": true,                     // Boolean
  "idBarrio": 1,                      // Integer (FK válido)
  "idTipoDoc": 1,                     // Integer (FK válido)
  "idRol": 2                          // Integer (VENDEDOR)
}
```

### Backend espera en UsuarioDto:
```java
@Data
public class UsuarioDto {
    private Integer numDocumento;      // ✅
    private String nombre1;            // ✅
    private String nombre2;            // ✅
    private String apellido1;          // ✅
    private String apellido2;          // ✅
    private String dire;               // ✅
    private Long tele;                 // ✅ (importante: LONG, no int)
    private String correoElectronico;  // ✅
    private String contra;             // ✅
    private Boolean activo;            // ✅
    private Integer idBarrio;          // ✅ (debe ser válido en BD)
    private Integer idTipoDoc;         // ✅ (debe ser válido en BD)
    private Integer idRol;             // ✅ (debe ser válido en BD)
}
```

## Validaciones que Ahora se Ejecutan

### En Frontend:
1. ✅ Campos requeridos: numDocumento, nombre1, apellido1, correoElectronico, contra, tele
2. ✅ Documento debe ser número > 0
3. ✅ Teléfono debe ser número > 0
4. ✅ Barrio debe estar seleccionado (idBarrio debe ser número > 0)
5. ✅ Tipo de documento debe estar seleccionado (idTipoDoc debe ser número > 0)

### En Backend:
1. ✅ idRol no puede ser nulo (validated en UsuarioController)
2. ✅ idBarrio no puede ser nulo (validated en UsuarioController)
3. ✅ idTipoDoc no puede ser nulo (validated en UsuarioController)
4. ✅ Las entidades relacionadas deben existir en la BD (throws EntityNotFoundException si no existen)

## Flujo de Ejecución Esperado

1. Usuario completa el formulario y hace clic en "Enviar"
2. Frontend valida campos requeridos
3. Frontend convierte strings a números usando `parseInt()`
4. Frontend valida que los números sean válidos (no NaN, > 0)
5. Frontend construye el objeto `vendedorData`
6. Frontend registra los datos en consola (para debugging)
7. Frontend envía POST a `http://localhost:8080/api/usu/crear`
8. Backend recibe UsuarioDto y valida campos no nulos
9. Backend carga las entidades relacionadas (Barrio, TipoDoc, Rol)
10. Backend encripta la contraseña con BCrypt
11. Backend guarda el usuario en la BD
12. Backend retorna HTTP 201 con el UsuarioDto creado
13. Frontend muestra mensaje de éxito
14. Frontend recarga la lista de vendedores

## Próximos Pasos para Testing

1. Ejecutar el formulario de creación de vendedor
2. Revisar la consola del navegador para:
   - Ver que `idBarrio` e `idTipoDoc` sean números válidos
   - Ver la respuesta exacta del servidor si hay error
3. Si aún hay Error 400:
   - Revisar los logs del backend Spring Boot
   - Ejecutar `setup-database.sql` para asegurar que barrios y tipos existan
   - Verificar que el token JWT sea válido

## Archivos Modificados

1. `FRONT/src/api/usuariosApi.js` - Error handling mejorado
2. `FRONT/src/pages/Seller_view/Reports/reports.component.jsx` - Corrección de DTOs y validaciones
3. `TESTING_VENDOR_CREATION.md` - Guía de prueba creada

## Status del Problema

🔧 **En Progreso**: Se han identificado y corregido los problemas principales. Pendiente: Testing en navegador.
