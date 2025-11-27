# 📦 Deployment Guide - Carga de Fotos

## Resumen de Cambios

Se ha implementado la Solución 1 (MultipartFile) para carga de imágenes de productos.

**Archivos Modificados:** 5  
**Archivos Creados:** 1 (carpeta uploads)  
**Tiempo de Implementación:** Completado ✅

---

## Archivos que Cambiaron

### 1. Backend - ArticuloController.java
**Ubicación:** `project/src/main/java/com/sga/project/controller/ArticuloController.java`

**Cambios:**
- ✅ Importados: `File`, `IOException`, `MultipartFile`, `RequestParam`
- ✅ Nuevo método POST: `/api/articulos/CrearConFoto`
- ✅ Método privado: `guardarImagen(MultipartFile)`

**Líneas de código agregadas:** ~50

**Validaciones:**
- Foto no puede estar vacía
- Nombre de archivo validado (null check)
- Extensión preservada
- Nombres únicos con timestamp

---

### 2. Backend - WebConfig.java
**Ubicación:** `project/src/main/java/com/sga/project/config/WebConfig.java`

**Cambios:**
- ✅ Importado: `ResourceHandlerRegistry`, `Paths`
- ✅ Nuevo método: `addResourceHandlers()`
- ✅ Mapeo de `/uploads/**` a carpeta local

**Líneas de código agregadas:** ~10

**Propósito:** Servir archivos estáticos desde carpeta uploads

---

### 3. Frontend - inventory.component.jsx
**Ubicación:** `FRONT/src/pages/Seller_view/Inventory/inventory.component.jsx`

**Cambios:**
- ✅ Estado `newArticle`: cambió `foto` (string) a `fotoArt` (File) + `previewUrl`
- ✅ Nueva función: `handleFotoChange()` con preview
- ✅ Actualizada función: `handleCreateArticle()` con FormData
- ✅ Actualizada función: `handleCancelCreate()` con limpieza
- ✅ Actualizado modal: reemplazado input text por file input

**Líneas de código modificadas:** ~80

**Características:**
- Validación de tipo MIME
- Preview en tiempo real
- Limpieza automática de Object URLs
- Integración con nueva API endpoint

---

### 4. Frontend - Inventory.styles.css
**Ubicación:** `FRONT/src/pages/Seller_view/Inventory/Inventory.styles.css`

**Cambios:**
- ✅ Nuevo: `.file-input-container`
- ✅ Nuevo: `.file-input-label` con gradiente
- ✅ Nuevo: `.preview-container`
- ✅ Nuevo: `.preview-image` con animaciones

**Líneas de código agregadas:** ~30

**Características:**
- Estilos personalizados para file input
- Animaciones hover
- Responsive design

---

### 5. Nueva Carpeta de Uploads
**Ubicación:** `project/src/main/resources/uploads/articulos/`

**Propósito:** Almacenar imágenes de artículos

**Estructura:**
```
project/src/main/resources/
└── uploads/
    └── articulos/
        ├── 1702639200000.jpg
        ├── 1702639201234.png
        └── ...
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Respaldar código actual
- [ ] Revisar cambios en Git: `git diff`
- [ ] Verificar no hay conflictos merge
- [ ] Confirmar estructura de carpetas

### Build Backend

```bash
cd project
mvn clean compile
```

**Expected Output:**
```
BUILD SUCCESS ✅
```

Si hay errores, revisar:
- Sintaxis Java
- Imports correctos
- Método `guardarImagen` implementado

### Build Frontend

```bash
cd FRONT
npm install  # Solo si agregaron deps (en este caso NO)
npm run build
```

**Expected Output:**
```
✓ built in XXXms ✅
```

### Iniciar Servicios

**Terminal 1 - Backend:**
```bash
cd project
mvn spring-boot:run
```

Esperar: `Started Application in X.XXX seconds`

**Terminal 2 - Frontend:**
```bash
cd FRONT
npm run dev
```

Esperar: `➜  Local:   http://localhost:5173/`

### Verificación Post-Deploy

1. **Backend activo:**
   ```bash
   curl http://localhost:8080/api/articulos
   ```
   Debe retornar JSON con artículos

2. **Frontend accesible:**
   ```
   Abrir: http://localhost:5173
   Navegar a: Inventario
   ```

3. **Endpoints funcionan:**
   ```bash
   # Test file upload
   curl -X POST \
     -F "nombre=Test" \
     -F "idCategoria=1" \
     -F "precioArt=5000" \
     -F "fotoArt=@/path/to/image.jpg" \
     -H "Authorization: Bearer {token}" \
     http://localhost:8080/api/articulos/CrearConFoto
   ```

---

## Rollback Plan

Si algo falla en producción:

### Opción 1: Git Revert (Recomendado)
```bash
git revert <commit-hash>
git push
```

### Opción 2: Manual Revert
1. Restaurar archivos originales de backup
2. `git checkout` versión anterior
3. Recompilar

### Opción 3: Borrar Uploads
Si carpeta uploads causa problemas:
```bash
rm -r project/src/main/resources/uploads/
```
El código recrea la carpeta automáticamente.

---

## Consideraciones en Producción

### Seguridad
- ✅ Validación de tipo MIME en cliente
- ✅ Validación en servidor
- ✅ Nombres únicos (no sobrescritura)
- ⚠️ TODO: Validar tamaño máximo
- ⚠️ TODO: Validar dimensiones de imagen

### Performance
- ✅ Carga asincrónica
- ✅ Preview con Object URLs (no base64)
- ⚠️ TODO: Implementar compresión
- ⚠️ TODO: Cache en cliente

### Storage
- Monitor espacio en disco para carpeta uploads/
- Implementar política de limpieza de archivos huérfanos
- Considerar CDN para servir imágenes a escala

---

## Documentación de API

### Endpoint Nuevo

```
POST /api/articulos/CrearConFoto
```

**Content-Type:** `multipart/form-data`

**Parámetros:**
```
nombre (string): Nombre del artículo [required]
idCategoria (integer): ID categoría [required]
precioArt (integer): Precio en pesos [required]
generoArt (string): Género [optional]
tallaArt (string): Talla [optional]
colorArt (string): Color [optional]
fotoArt (file): Archivo imagen [required]
```

**Headers:**
```
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data
```

**Response Success (201):**
```json
{
  "mensaje": "Articulo creado con exito",
  "data": {
    "idArt": 123,
    "nombre": "Vestido Rojo",
    "precioArt": 50000,
    "fotoArt": "/uploads/articulos/1702639200000.jpg",
    "activo": true,
    ...
  }
}
```

**Response Error (400):**
```json
{
  "error": "La foto es requerida"
}
```

---

## Environment Variables

No requiere variables de ambiente nuevas.

**Configuraciones relevantes en `application.properties`:**
```properties
# Ya existentes, sin cambios necesarios
server.port=8080
spring.jpa.hibernate.ddl-auto=update
```

---

## Monitoreo Post-Deployment

### Logs a revisar

**Backend Console:**
- `INFO` - Request POST a `/CrearConFoto`
- `DEBUG` - Detalles de guardado de archivo

**Frontend Console (F12):**
- `Estado actual newArticle: {...}`
- `FormData a enviar al backend`

### Métricas

Monitorear:
- Tiempo de respuesta POST `/CrearConFoto`
- Tamaño promedio de archivos
- Espacio usado en carpeta uploads/
- Errores de tipo 400/500 en endpoint

---

## Troubleshooting Rápido

| Problema | Causa | Solución |
|----------|-------|----------|
| 404 en imagen | WebConfig no compiló | `mvn clean compile` |
| "La foto es requerida" | No se seleccionó | Seleccionar en modal |
| No es imagen | Archivo .txt/pdf | Solo JPG/PNG/WEBP |
| Timeout | Archivo muy grande | Aumentar timeout, o validar tamaño |
| CORS error | Token inválido | Login nuevamente |

---

## Timeline de Deployment

**Recomendado:**
1. Deploy en ambiente DEV (local) - 5 min
2. Testing manual completo - 30 min
3. Deploy en ambiente QA - 5 min
4. Validación QA - 15 min
5. Deploy PRODUCCIÓN - 5 min

**Total: ~60 minutos**

---

## Comunicación al Equipo

**Para vendedores:**
> "Nuevo: Ya no necesitas URL de fotos. Ahora puedes cargar imágenes directo desde tu computadora. Click en Inventario → + Crear Artículo → Seleccionar foto"

**Para developers:**
> "Se implementó multipart upload en ArticuloController + WebConfig. Endpoint POST /CrearConFoto guarda archivos en src/main/resources/uploads/articulos/"

**Para DevOps:**
> "Nueva carpeta de uploads requiere permisos de escritura. Monitorear espacio en disco. Considerar políticas de backup/limpieza de archivos."

---

## Follow-Up Tasks

### Corto Plazo (próxima sprint)
- [ ] Agregar validación de tamaño máximo
- [ ] Agregar validación de dimensiones
- [ ] Implementar compresión de imágenes
- [ ] Agregar análisis de virus en servidor

### Mediano Plazo (2-3 sprints)
- [ ] Integrar CDN para servir imágenes
- [ ] Implementar cache en cliente
- [ ] Agregar conversión a WebP
- [ ] Crear dashboard de uso de storage

### Largo Plazo
- [ ] Implementar S3/cloud storage
- [ ] Multi-tenant storage isolation
- [ ] Versionado de imágenes
- [ ] Galería con múltiples fotos por producto

---

**Deployment Status:** ✅ LISTO  
**Último Updated:** 2024-12-15  
**Reviewed by:** GitHub Copilot
