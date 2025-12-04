# Testing Vendor Creation - Guía de Prueba

## Cambios Realizados

### 1. Frontend - `reports.component.jsx`
- ✅ Agregado validación de `idBarrio` e `idTipoDoc` después de `parseInt()`
- ✅ Agregado logging detallado de los datos enviados y sus tipos
- ✅ Mejorado error handling para mostrar mensajes específicos

### 2. Frontend - `usuariosApi.js`
- ✅ Mejorado error handling para extraer mensajes específicos del backend
- ✅ Ahora registra en consola los errores exactos del servidor

### 3. Frontend - Corrección de DTOs
- ✅ Cambió `tipo.id_tipoDoc` → `tipo.idTipoDoc` (snake_case → camelCase)
- ✅ Verificó que `barrio.idBarrio` y `barrio.nombreBarrio` sean camelCase (ya estaban correctos)

## Cómo Probar

### Prerequisitos
1. Backend Spring Boot ejecutándose en `http://localhost:8080`
2. Frontend React ejecutándose en `http://localhost:5173`
3. Base de datos `pruebita` debe tener datos iniciales (barrios y tipos de documento)

### Pasos de Prueba

1. **Abre el navegador y accede a**: `http://localhost:5173`

2. **Login como vendedor**:
   - Email: `vendedor@ejemplo.com`
   - Contraseña: `123456`

3. **Navega a Reports → Vendedores**

4. **Haz clic en "Crear Nuevo Vendedor"** (botón + verde)

5. **Completa el formulario**:
   - Número de Documento: `1234567890`
   - Tipo de Documento: Selecciona cualquiera (ej: "Cédula de Ciudadanía")
   - Primer Nombre: `Juan`
   - Segundo Nombre: (dejar vacío)
   - Primer Apellido: `Pérez`
   - Segundo Apellido: (dejar vacío)
   - Correo Electrónico: `juan@ejemplo.com`
   - Teléfono: `3001234567`
   - Contraseña: `password123`
   - Dirección: (dejar vacío o llenar)
   - Barrio: Selecciona cualquiera (ej: "Centro")

6. **Haz clic en "Enviar"**

### Qué Verificar en la Consola del Navegador (F12)

#### Antes del envío:
```
Enviando datos del vendedor: {
  numDocumento: 1234567890,
  nombre1: "Juan",
  nombre2: null,
  apellido1: "Pérez",
  apellido2: null,
  dire: null,
  tele: 3001234567,
  correoElectronico: "juan@ejemplo.com",
  contra: "password123",
  activo: true,
  idBarrio: 1,      // Debe ser un número
  idTipoDoc: 1,     // Debe ser un número
  idRol: 2
}
Tipo de datos: {
  numDocumento: "number",
  tele: "number",
  idBarrio: "number",
  idTipoDoc: "number",
  idRol: "number"
}
```

#### Si hay error:
```
Error del servidor: { error: "..." }
```

### Casos de Éxito
- ✅ Sin error 400: El vendedor se crea exitosamente
- ✅ Mensaje "Vendedor creado exitosamente"
- ✅ El nuevo vendedor aparece en la tabla de Vendedores
- ✅ Console muestra la respuesta del servidor

### Casos de Error a Verificar
Si aún hay error 400:
1. Verifica que `idBarrio` e `idTipoDoc` sean números válidos
2. Verifica que el backend tiene barrios y tipos de documento (ejecuta setup-database.sql)
3. Revisa los logs del backend Spring Boot para ver el error exacto
4. Asegúrate de que el token JWT sea válido

## Información de Base de Datos

Los siguientes datos deben estar en la base de datos después de ejecutar `setup-database.sql`:

### Barrios (tabla: barrio)
- ID 1: Centro
- ID 2: Norte
- ID 3: Sur
- ID 4: Oriente
- ID 5: Occidente

### Tipos de Documento (tabla: tipo_doc)
- ID 1: Cédula de Ciudadanía
- ID 2: Cédula de Extranjería
- ID 3: Pasaporte
- ID 4: NIT

### Roles (tabla: rol)
- ID 1: ADMIN
- ID 2: VENDEDOR
- ID 3: CLIENTE

## Logs Importantes a Revisar

En el backend (Spring Boot):
```bash
# Ver los logs de creación del usuario
tail -f ./project/target/*.log
```

En el frontend (Navegador):
```javascript
// Abre la consola (F12) y filtra por "Enviando" o "Respuesta"
```

## Si Sigue Sin Funcionar

1. Verifica que `src/pages/Seller_view/Reports/reports.component.jsx` tenga los cambios correctos
2. Verifica que `src/api/usuariosApi.js` tenga el nuevo error handling
3. Limpia el cache del navegador (Ctrl+Shift+Delete)
4. Recarga la página (Ctrl+F5)
5. Revisa que los barrios y tipos de documento se carguen en el select
   - En consola: `window.localStorage.getItem('sga_token')` debe devolver un token válido
   - Los selects deben mostrar las opciones disponibles
