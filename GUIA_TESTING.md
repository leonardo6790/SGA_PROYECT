# 🧪 Guía de Testing - Carga de Fotos con MultipartFile

## Inicio Rápido (5 minutos)

### Paso 1: Compilar Backend
```bash
cd "c:\Users\SENA\Desktop\SGA sisi\project"
mvn clean compile
mvn spring-boot:run
```

Esperar mensaje: `Started Application in X.XXX seconds`

### Paso 2: Iniciar Frontend
```bash
cd "c:\Users\SENA\Desktop\SGA sisi\FRONT"
npm run dev
```

Abrir en navegador: `http://localhost:5173`

### Paso 3: Test Rápido
1. Login como vendedor
2. Ir a Inventario
3. Click "+" → Crear Artículo
4. Seleccionar foto
5. Completar datos
6. Click Crear
7. ✅ Artículo debe aparecer con imagen

---

## Testing Detallado

### 1. Preview de Imagen

**Objetivo:** Verificar que el usuario ve la imagen antes de crear el artículo

**Pasos:**
1. Abrir modal de crear artículo
2. Click en "Seleccionar foto"
3. Elegir imagen: `C:\Users\SENA\Desktop\test_image.jpg` (o cualquiera)
4. Ver preview aparecer debajo del botón

**Resultado Esperado:**
- ✅ Label cambia a "Foto seleccionada ✓"
- ✅ Preview de imagen se muestra debajo
- ✅ Imagen cabe en contenedor (max-height: 250px)

---

### 2. Validación de Tipo de Archivo

**Objetivo:** Rechazar archivos no-imagen

**Test A: Rechazar documento PDF**
1. Abrir modal
2. Click "Seleccionar foto"
3. Seleccionar un archivo .pdf o .docx
4. **Resultado:** Debe mostrar alerta "Por favor selecciona un archivo de imagen"
5. **Verificar:** No debe haber preview

**Test B: Rechazar archivo de texto**
1. Abrir modal
2. Click "Seleccionar foto"
3. Seleccionar archivo .txt
4. **Resultado:** Debe rechazar
5. **Verificar:** No debe haber preview

**Test C: Aceptar imagen válida**
1. Abrir modal
2. Click "Seleccionar foto"
3. Seleccionar: .jpg, .png, .webp, .gif
4. **Resultado:** Debe aceptar y mostrar preview

---

### 3. Crear Artículo Exitosamente

**Objetivo:** Verificar flujo completo de creación

**Datos de Prueba:**
```
Nombre: Vestido Azul Elegante
Género: Dama
Talla: M
Color: Azul
Precio: 75000
Categoría: Formales
Foto: cualquier imagen válida
```

**Pasos:**
1. Abrir modal
2. Llenar cada campo con datos de prueba
3. Seleccionar foto
4. Click "Crear Artículo"

**Verificaciones:**
- ✅ Modal desaparece
- ✅ No hay errores en consola (F12)
- ✅ Artículo aparece en lista
- ✅ Nombre es correcto: "Vestido Azul Elegante"
- ✅ Precio muestra: "$75,000"
- ✅ Imagen carga correctamente

**En Console (F12):**
```
Estado actual newArticle: {...}
FormData a enviar al backend
(no debe haber errors)
```

---

### 4. Validación: Sin Foto

**Objetivo:** Verificar que se requiere foto

**Pasos:**
1. Abrir modal
2. Llenar todos los campos EXCEPTO no seleccionar foto
3. Click "Crear Artículo"

**Resultado Esperado:**
- ✅ Alerta: "Por favor selecciona una foto"
- ✅ Modal se mantiene abierto
- ✅ Datos no se pierden (pueden editarse más)

---

### 5. Cancelar Operación

**Objetivo:** Verificar limpieza de recursos al cancelar

**Pasos:**
1. Abrir modal
2. Seleccionar foto (ver preview)
3. Completar algunos datos
4. Click "Cancelar"

**Verificaciones:**
- ✅ Modal cierra
- ✅ Preview desaparece
- ✅ Siguiente modal abierto está completamente vacío
- ✅ No hay memory leaks (URL revocadas correctamente)

**En Console:**
```
// No debe haber warnings sobre "blob: URL"
```

---

### 6. Persistencia de Datos

**Objetivo:** Verificar que la imagen se guarda en BD y servidor

**Pasos:**
1. Crear artículo con foto (como en test 3)
2. Anotar ID o nombre del artículo
3. Recargar página (F5)
4. Buscar el artículo en lista

**Verificaciones:**
- ✅ Artículo sigue visible después de recargar
- ✅ Imagen sigue cargando correctamente
- ✅ Datos no se han perdido
- ✅ Ningún error 404 en consola

**Verificar URL de Imagen:**
1. Click derecho en imagen del artículo
2. "Inspeccionar elemento"
3. Buscar `<img>` tag
4. Atributo `src` debe ser: `/uploads/articulos/{numero}.{ext}`
5. Copiar URL y abrir en navegador nueva pestaña
6. Imagen debe mostrarse directamente

---

### 7. Múltiples Artículos

**Objetivo:** Verificar que no hay conflictos con nombres de archivo

**Pasos:**
1. Crear artículo 1 con foto A (rápido)
2. Inmediatamente crear artículo 2 con foto B
3. Inmediatamente crear artículo 3 con foto C
4. Esperar a que todos terminen

**Verificaciones:**
- ✅ Los 3 artículos se crean
- ✅ Imágenes de cada uno son diferentes
- ✅ Nombres de archivo son únicos (timestamp diferente)
- ✅ No hay conflictos o sobrescrituras

**Verificar en Disco:**
```bash
cd "project/src/main/resources/uploads/articulos"
dir

# Debe haber 3 archivos con nombres diferentes:
# - 1702639200000.jpg (primero)
# - 1702639200001.jpg (segundo)
# - 1702639200002.jpg (tercero)
```

---

### 8. Filtrado por Categoría

**Objetivo:** Verificar que imágenes cargan correctamente cuando se filtra

**Pasos:**
1. Crear 3 artículos con diferentes categorías:
   - Artículo 1: Categoría "Formales"
   - Artículo 2: Categoría "Casuales"
   - Artículo 3: Categoría "Formales"
2. Click en filtro "Formales"
3. Deben aparecer solo artículos 1 y 3
4. Click en filtro "Casuales"
5. Debe aparecer solo artículo 2

**Verificaciones:**
- ✅ Imágenes se muestran correctamente en cada filtro
- ✅ No hay errores 404
- ✅ Cambios de filtro son rápidos

---

### 9. Tamaño de Imagen

**Objetivo:** Probar con diferentes tamaños

**Test A: Imagen Pequeña (<100KB)**
1. Usar foto de baja resolución
2. Crear artículo
3. Debe funcionar sin problema

**Test B: Imagen Grande (3-5MB)**
1. Usar foto de alta resolución
2. Crear artículo
3. Puede tomar más tiempo pero debe funcionar
4. Verificar tiempo de respuesta < 3 segundos

**Test C: Imagen Muy Grande (>10MB)**
1. Usar foto de muy alta resolución
2. Crear artículo
3. Puede fallar o ser muy lento (esto es esperado sin validación de tamaño)

---

### 10. Responsividad

**Objetivo:** Verificar que funciona en diferentes tamaños de pantalla

**Desktop (1920x1080):**
- [ ] Modal se ve bien
- [ ] Preview visible completamente
- [ ] Botones accesibles

**Tablet (768x1024):**
- [ ] Modal responsivo
- [ ] Preview visible
- [ ] No overflow

**Mobile (375x667):**
- [ ] Modal cabe en pantalla
- [ ] Preview scroll si es necesario
- [ ] Botones presionables

---

## Testing en Browser Console

### Ver qué se envía
```javascript
// En la consola F12, añadir log antes de crear
localStorage.setItem("debug", "true")

// Luego crear artículo y ver logs en consola
```

### Inspeccionar FormData
```javascript
// Después de crear, en console:
fetch("http://localhost:8080/api/articulos/CrearConFoto", {
  method: "POST",
  body: new FormData() // Puede inspeccionar estructura
})
```

### Verificar Token JWT
```javascript
// En console:
localStorage.getItem("sga_token")
// Debe retornar un token largo (no null/undefined)
```

---

## Casos de Error (Esperados a Capturar)

### Error 1: Directorio no existe
```
Error: ENOENT: no such file or directory
```
**Solución:** Backend crea automáticamente, si falla es error de permisos

### Error 2: Archivo bloqueado
```
Error: File already in use
```
**Solución:** Normalmente no ocurre, pero reiniciar servidor

### Error 3: Token expirado
```
401 Unauthorized
```
**Solución:** Hacer logout y login nuevamente

### Error 4: CORS
```
Access to XMLHttpRequest blocked by CORS
```
**Solución:** Verificar WebConfig.java tiene CORS configurado

---

## Performance Baseline

Establecer medidas de referencia (baseline):

| Operación | Tiempo Esperado |
|-----------|-----------------|
| Cargar Inventario | < 1s |
| Abrir Modal | < 500ms |
| Seleccionar foto | < 100ms |
| Mostrar preview | < 500ms |
| Crear artículo | < 3s |
| Recargar lista | < 1.5s |

---

## Checklist Final

- [ ] Backend compila sin errores
- [ ] Frontend carga sin errores
- [ ] Crear artículo exitoso
- [ ] Imagen se muestra
- [ ] Imagen persiste después de recargar
- [ ] Validaciones funcionan (sin foto = error)
- [ ] Cancelar limpia preview
- [ ] Múltiples artículos sin conflictos
- [ ] Filtros funcionan correctamente
- [ ] Performance aceptable

---

## Notas de Debugging

Si algo falla, revisar:

1. **Browser Console (F12):**
   ```
   Errores en rojo = revisar
   Warnings amarillo = informativo
   ```

2. **Network Tab (F12 → Network):**
   ```
   POST /api/articulos/CrearConFoto
   Debe retornar 201 (created) o 200 (ok)
   Si 40x o 50x = error
   ```

3. **Backend Console:**
   ```
   mvn spring-boot:run salida
   Buscar "ERROR" o "Exception"
   ```

4. **Carpeta de Uploads:**
   ```
   project/src/main/resources/uploads/articulos/
   Debe tener archivos con nombres: {timestamp}.{ext}
   ```

---

**Duración estimada del testing completo: 30-45 minutos**

Reporte después de completar este testing manual para validación oficial.
