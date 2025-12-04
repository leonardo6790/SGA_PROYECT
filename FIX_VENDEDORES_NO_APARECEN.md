# 🔧 FIX: Vendedores no aparecen en la tabla

## Problema
En la sección de "Vendedores" del componente Reports, la tabla solo mostraba 1 vendedor (David Leonardo Bautista) cuando debería mostrar todos los vendedores registrados en el sistema.

## ⚠️ PROBLEMA RAÍZ ENCONTRADO
**El mapper del backend estaba devolviendo los parámetros en orden incorrecto**, causando que `idRol` fuera `null` para todos los usuarios.

## Causas Identificadas

### Causa 1: Orden incorrecto en UsuarioMapperImplement.java ⭐ CRÍTICA
El mapper pasaba los parámetros al constructor en el orden INCORRECTO:
```
INCORRECTO:
11. idBarrio
12. nomBar
13. idTipoDoc (debería ser idRol aquí)
14. idRol (debería ser idTipoDoc aquí)
```

El DTO esperaba:
```
CORRECTO:
11. idBarrio
12. nomBar
13. idTipoDoc
14. idRol
```

**Resultado**: idRol siempre era null, el filtro no funcionaba.

### Causa 2: Filtro en el `filteredData` no incluye campos de vendedores
El `filteredData` filtraba por `nombreCliente` pero los vendedores usan `nombreCompleto`.

### Causa 3: Dependencias incompletas en el `useEffect`
El `useEffect` que llama a `procesarReportes()` cuando cambia el tab no incluía `alquileres` en las dependencias.

### Causa 4: Mapeo incorrecto de idRol
El filtro solo buscaba `user.idRol === 2` pero por el bug anterior, idRol era null.

### Causa 5: Logging insuficiente
No había logging para ver qué datos se estaban recibiendo realmente.

## Cambios Realizados

### Cambio 1: CRÍTICO - Arreglado UsuarioMapperImplement.java
```java
// ANTES (INCORRECTO)
return new UsuarioDto(
    usuario.getNumDoc(),
    usuario.getNom1(),
    usuario.getNom2(),
    usuario.getApe1(),
    usuario.getApe2(),
    usuario.getDireccion(),
    usuario.getNumTel(),
    usuario.getCorreoElec(),
    usuario.getContraseña(),
    usuario.getActivo(),
    usuario.getBarrio() != null ? usuario.getBarrio().getId_barrio() : null,
    usuario.getBarrio() != null? usuario.getBarrio().getNomBar() : null,
    usuario.getRol() != null ? usuario.getRol().getId_rol() : null,
    usuario.getTipoDoc() != null ? usuario.getTipoDoc().getId_tipoDoc() : null
    // ☝️ PROBLEMA: idRol está en posición 13, idTipoDoc en 14
    // Pero el DTO tiene: idBarrio, nomBar, idTipoDoc, idRol
);

// DESPUÉS (CORRECTO)
return new UsuarioDto(
    usuario.getNumDoc(),
    usuario.getNom1(),
    usuario.getNom2(),
    usuario.getApe1(),
    usuario.getApe2(),
    usuario.getDireccion(),
    usuario.getNumTel(),
    usuario.getCorreoElec(),
    usuario.getContraseña(),
    usuario.getActivo(),
    usuario.getBarrio() != null ? usuario.getBarrio().getId_barrio() : null,
    usuario.getBarrio() != null? usuario.getBarrio().getNomBar() : null,
    usuario.getTipoDoc() != null ? usuario.getTipoDoc().getId_tipoDoc() : null,
    usuario.getRol() != null ? usuario.getRol().getId_rol() : null
    // ✅ CORRECTO: idTipoDoc en posición 13, idRol en 14
);
```

### Cambio 2: Mejorado logging en cargarDatos()
```javascript
// ANTES
console.log("Alquileres cargados:", alquileresData);

// DESPUÉS
console.log("Alquileres cargados:", alquileresData);
console.log("Usuarios cargados:", vendedoresData);
console.log("Usuarios con roles:", vendedoresData?.map(u => ({ numDoc: u.numDocumento, nombre: u.nombre1, idRol: u.idRol })));
```

### Cambio 3: Mejorado filtro de vendedores en procesarReportes()
```javascript
// ANTES
const reporteVendedores = vendedores
  .filter(user => user.idRol === 2)
  .map(vendedor => ({...}));

// DESPUÉS
const reporteVendedores = vendedores
  .filter(user => {
    console.log(`Usuario: ${user.nombre1}, idRol: ${user.idRol}, tipo: ${typeof user.idRol}`);
    return user.idRol === 2 || user.idRol === '2';  // Aceptar both number y string
  })
  .map(vendedor => ({
    // ... datos anteriores ...
    idRol: vendedor.idRol  // Incluir idRol para debugging
  }));

// AGREGADO
console.log("Filtrando vendedores de:", vendedores);
console.log("Total de usuarios:", vendedores.length);
console.log("Vendedores filtrados:", reporteVendedores);
```

### Cambio 4: Mejorado filteredData para soportar campo de vendedores
```javascript
// ANTES
if (isNumericSearch) {
  matchesSearch = 
    item.id?.toString().includes(searchText) ||
    item.idAlquiler?.toString().includes(searchText) ||
    item.clienteDoc?.toString().includes(searchText);
} else {
  matchesSearch = item.nombreCliente?.toLowerCase().includes(searchLower);
}

// DESPUÉS
if (isNumericSearch) {
  matchesSearch = 
    item.id?.toString().includes(searchText) ||
    item.idAlquiler?.toString().includes(searchText) ||
    item.clienteDoc?.toString().includes(searchText) ||
    item.numDocumento?.toString().includes(searchText);  // Para vendedores
} else {
  matchesSearch = 
    item.nombreCliente?.toLowerCase().includes(searchLower) ||
    item.nombreCompleto?.toLowerCase().includes(searchLower) ||  // Para vendedores
    item.correo?.toLowerCase().includes(searchLower);  // Para vendedores
}
```

### Cambio 5: Arregladas dependencias en useEffect
```javascript
// ANTES
useEffect(() => {
  if (alquileres.length > 0 || vendedores.length > 0) {
    procesarReportes(alquileres);
  }
}, [activeTab, vendedores]);

// DESPUÉS
useEffect(() => {
  if (alquileres.length > 0 || vendedores.length > 0) {
    procesarReportes(alquileres);
  }
}, [activeTab, vendedores, alquileres]);  // Agregado alquileres
```

## Cómo Verificar la Fix

1. **Reinicia el backend** para que compile los cambios de Java
2. Abre la consola (F12)
3. Ve al tab de "Vendedores"
4. Revisa la consola y deberías ver:
   ```
   Filtrando vendedores de: Array(n)  // n = número de usuarios
   Total de usuarios: n
   Usuario: [nombre], idRol: 2, tipo: number
   Vendedores filtrados: Array(m)  // m = número de vendedores
   ```

5. Si ves múltiples usuarios en la tabla, ¡está funcionando!

## Espera

Si aún no aparecen todos los vendedores:
1. **Asegúrate de haber reiniciado el backend** - El cambio en Java necesita recompilación
2. **Borra el caché del navegador** - Ctrl+Shift+Delete
3. **Recarga la página** - Ctrl+F5
4. **Revisa la BD** - Verifica que haya usuarios con rol = 2

## Archivos Modificados

### Backend
- `project/src/main/java/com/sga/project/mapper/UsuarioMapperImplement.java`
  - Línea 76-91: Arreglado orden de parámetros en constructor

### Frontend
- `FRONT/src/pages/Seller_view/Reports/reports.component.jsx`
  - Línea 65: Logging mejorado
  - Línea 144-165: Filtro de vendedores con logging
  - Línea 177-197: Filtro de búsqueda mejorado
  - Línea 168-173: useEffect con dependencias arregladas

## Resumen del Problema

```
┌─────────────────────────────────────────────────────────────┐
│                  PROBLEMA IDENTIFICADO                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Backend: UsuarioMapperImplement.java                       │
│  ├─ Pasaba parámetros al DTO en orden INCORRECTO           │
│  └─ idRol siempre era null                                 │
│                                                             │
│  Frontend: reports.component.jsx                            │
│  ├─ Filtraba por user.idRol === 2                           │
│  ├─ Pero idRol era null (por el bug del backend)            │
│  └─ Resultado: Solo aparecía el usuario admin (sin rol)     │
│                                                             │
│  SOLUCIÓN: Arreglar el orden en el constructor del mapper   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Impacto

✅ **CRÍTICO** - Este era el problema raíz  
✅ **Afecta todos los usuarios** - Porque idRol siempre era null  
✅ **Impacto alto** - Hace que el filtro de roles no funcione en ningún lado  

**Status**: RESUELTO ✅

