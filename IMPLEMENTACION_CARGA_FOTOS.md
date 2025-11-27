# Implementación de Carga de Fotos - Solución 1 (MultipartFile)

## Resumen

Se ha implementado exitosamente la **Solución 1** del documento SOLUCIONES_CARGA_FOTOS.md: **Subir archivo al backend con MultipartFile**.

Esta solución permitirá que los vendedores carguen fotos de productos directamente desde el explorador de archivos en lugar de proporcionar URLs.

---

## Cambios Realizados

### 1. Backend - ArticuloController.java

#### Nuevo Endpoint POST `/api/articulos/CrearConFoto`

```java
@PostMapping("/CrearConFoto")
public ResponseEntity<?> crearConFoto(
        @RequestParam("nombre") String nombre,
        @RequestParam("idCategoria") Integer idCategoria,
        @RequestParam("precioArt") Integer precioArt,
        @RequestParam(value = "generoArt", required = false) String generoArt,
        @RequestParam(value = "tallaArt", required = false) String tallaArt,
        @RequestParam(value = "colorArt", required = false) String colorArt,
        @RequestParam("fotoArt") MultipartFile fotoArt)
```

**Características:**
- Acepta parámetros multipart (formulario + archivo)
- Valida que la foto no esté vacía
- Guarda la imagen en el servidor
- Retorna la URL relativa para almacenar en BD
- Maneja excepciones apropiadamente

#### Método Auxiliar `guardarImagen(MultipartFile archivo)`

**Funcionalidades:**
- Crea directorio `src/main/resources/uploads/articulos` si no existe
- Genera nombre único usando timestamp + extensión original
- Valida que el nombre del archivo no sea null
- Transfiere el archivo al servidor
- Retorna URL relativa: `/uploads/articulos/{timestamp}.{ext}`

**Seguridad:**
- Validación de null pointer en nombre del archivo
- Directorio centralizado para uploads
- Nombres únicos para evitar conflictos

### 2. Backend - WebConfig.java

#### Nueva Configuración de Resource Handler

```java
@Override
public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
    // Servir archivos estáticos desde la carpeta uploads
    String uploadsPath = Paths.get("src/main/resources/uploads").toAbsolutePath().toUri().toString();
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations(uploadsPath);
}
```

**Propósito:**
- Permite servir archivos estáticos desde el directorio de uploads
- Los archivos serán accesibles vía HTTP en `/uploads/...`
- Integrado con la configuración CORS existente

### 3. Directorio de Uploads

Se creó la estructura de directorios:
```
project/src/main/resources/
└── uploads/
    └── articulos/
```

Este directorio almacenará todas las imágenes de productos cargadas.

### 4. Frontend - inventory.component.jsx

#### Cambios en el Estado del Modal

```jsx
const [newArticle, setNewArticle] = useState({
  nomArt: "",
  genero: "",
  talla: "",
  color: "",
  precio: "",
  fotoArt: null,           // Ahora es File en lugar de string
  idCategoria: "",
  previewUrl: ""           // URL para preview
});
```

#### Nueva Función `handleFotoChange`

Maneja la selección de archivos con:
- Validación de tipo MIME (debe ser imagen)
- Generación de preview URL usando `URL.createObjectURL()`
- Limpieza de URLs anteriores para evitar memory leaks
- Gestión segura de recursos

```jsx
const handleFotoChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen");
      return;
    }
    
    // Crear preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Limpiar URL anterior si existe
    if (newArticle.previewUrl) {
      URL.revokeObjectURL(newArticle.previewUrl);
    }
    
    setNewArticle({
      ...newArticle,
      fotoArt: file,
      previewUrl: previewUrl
    });
  }
};
```

#### Función `handleCreateArticle` Actualizada

Ahora usa `FormData` para enviar multipart:

```jsx
// Crear FormData para enviar archivo
const formData = new FormData();
formData.append("nombre", newArticle.nomArt);
formData.append("generoArt", newArticle.genero);
formData.append("tallaArt", newArticle.talla);
formData.append("colorArt", newArticle.color);
formData.append("precioArt", parseInt(newArticle.precio));
formData.append("fotoArt", newArticle.fotoArt);
formData.append("idCategoria", parseInt(newArticle.idCategoria));

// Enviar al nuevo endpoint que soporta multipart
const token = localStorage.getItem("sga_token");
const response = await fetch("http://localhost:8080/api/articulos/CrearConFoto", {
  method: "POST",
  body: formData,
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

#### Función `handleCancelCreate` Actualizada

Limpia correctamente los recursos:
- Revoca Object URLs para liberar memoria
- Resetea el estado completo del formulario

#### Input de Archivo en el Modal

Reemplazó el input de texto por:
- File input personalizado con estilos
- Preview en tiempo real de la imagen seleccionada
- Botón estilizado que muestra estado de selección

```jsx
<div className="file-input-container">
  <label htmlFor="foto-input" className="file-input-label">
    {newArticle.previewUrl ? "Foto seleccionada ✓" : "Seleccionar foto"}
  </label>
  <input
    id="foto-input"
    type="file"
    accept="image/*"
    onChange={handleFotoChange}
    required
    style={{ display: "none" }}
  />
  {newArticle.previewUrl && (
    <div className="preview-container">
      <img src={newArticle.previewUrl} alt="Preview" className="preview-image" />
    </div>
  )}
</div>
```

### 5. Frontend - Inventory.styles.css

Nuevos estilos agregados:

```css
.file-input-container {
  margin: 15px 0;
}

.file-input-label {
  display: inline-block;
  padding: 10px 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.file-input-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.preview-container {
  margin-top: 15px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 250px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}
```

---

## Flujo de Funcionamiento

### Para el Usuario (Vendedor)

1. Navega a la sección de Inventario
2. Hace clic en el botón "+ Agregar Artículo"
3. Completa los campos del formulario
4. En lugar de pegar una URL, hace clic en "Seleccionar foto"
5. Elige una imagen de su computadora desde el explorador de archivos
6. Ve una preview de la imagen seleccionada
7. Hace clic en "Crear Artículo"
8. La imagen se carga al servidor y se guarda en la BD
9. El inventario se actualiza mostrando el nuevo artículo

### Técnico (Backend)

1. Cliente envía POST a `/api/articulos/CrearConFoto` con multipart/form-data
2. Backend recibe el archivo via `MultipartFile`
3. Valida que no esté vacío
4. Genera nombre único con timestamp
5. Guarda en `src/main/resources/uploads/articulos/{timestamp}.{ext}`
6. Almacena URL relativa en BD (`/uploads/articulos/{timestamp}.{ext}`)
7. Retorna respuesta con datos del artículo creado

### Técnico (Frontend)

1. Usuario selecciona archivo
2. Se valida que sea imagen
3. Se crea Object URL para preview
4. Se renderiza preview en tiempo real
5. Al enviar, se crea FormData con todos los parámetros
6. Se envía POST a nuevo endpoint
7. Se recarga la lista de artículos

---

## Ventajas de Esta Solución

✅ **Seguridad Alta**: Control total del servidor sobre dónde se guardan los archivos  
✅ **Facilidad de Uso**: Vendedores no necesitan URL de imágenes externas  
✅ **Centralización**: Todas las imágenes en un único servidor  
✅ **Validación**: Verificación en cliente y servidor  
✅ **Preview Inmediato**: Usuario ve la imagen antes de crear  
✅ **Manejo de Errores**: Validaciones robustas en ambos lados  
✅ **Limpieza de Memoria**: Revoke de Object URLs para evitar memory leaks  

---

## Próximas Mejoras Opcionales

1. **Compresión de Imágenes**: Reducir tamaño de archivos en backend
2. **Validación de Tamaño**: Limitar tamaño máximo de archivo
3. **Validación de Dimensiones**: Requerir dimensiones mínimas
4. **Conversión de Formato**: Normalizar a formato único (WebP, etc.)
5. **Caché**: Implementar caché para imágenes frecuentes
6. **CDN**: Integrar CDN para servir imágenes más rápido

---

## Instrucciones de Deployment

### Compilación del Backend

```bash
cd project
mvn clean compile
mvn spring-boot:run
```

**Asegúrate que:**
- Port 8080 esté disponible
- Los directorios de uploads se crean automáticamente
- CORS está configurado para tu frontend URL

### Verificación del Frontend

El frontend ya está actualizado. Al hacer push:
1. Las dependencias (npm packages) ya están disponibles
2. No se requiere instalación adicional
3. Los estilos están integrados en Inventory.styles.css

---

## Testing Manual

### 1. Crear Artículo con Foto

- [ ] Navegar a Inventario
- [ ] Click en "+ Agregar Artículo"
- [ ] Completar todos los campos
- [ ] Seleccionar una imagen JPG/PNG/WEBP
- [ ] Ver preview de la imagen
- [ ] Click en "Crear Artículo"
- [ ] Verificar que el artículo aparece en la lista
- [ ] Verificar que la imagen se muestra correctamente

### 2. Validaciones

- [ ] Intentar crear sin seleccionar foto → Debe mostrar error
- [ ] Intentar seleccionar archivo no-imagen → Debe rechazar
- [ ] Cancelar mientras hay foto seleccionada → Debe limpiar

### 3. Performance

- [ ] Cargar imagen grande (>5MB) → Debe funcionar
- [ ] Múltiples creaciones rápidas → No debe fallar
- [ ] Verificar que las imágenes se sirven desde `/uploads/**`

---

## Notas Importantes

⚠️ **Antes de iniciar el servidor:**
- Asegúrate que `AlquilerMapperImplement.java` está compilado con el fix del `setEntregado()`
- Reinicia el servidor Spring Boot después de cambios

📁 **Estructura de archivos guardados:**
```
src/main/resources/uploads/articulos/
├── 1704067200000.jpg
├── 1704067201234.png
├── 1704067202567.webp
└── ...
```

🔗 **URLs de acceso:**
- Frontend: `http://localhost:5173/home-seller/inventory`
- Backend API: `http://localhost:8080/api/articulos/CrearConFoto`
- Imágenes: `http://localhost:8080/uploads/articulos/{filename}`

---

## Archivos Modificados

1. ✅ `project/src/main/java/com/sga/project/controller/ArticuloController.java`
   - Agregados: POST `/CrearConFoto` + método `guardarImagen()`

2. ✅ `project/src/main/java/com/sga/project/config/WebConfig.java`
   - Agregado: Resource handler para `/uploads/**`

3. ✅ `project/src/main/resources/uploads/articulos/` (creado)
   - Directorio para almacenar imágenes

4. ✅ `FRONT/src/pages/Seller_view/Inventory/inventory.component.jsx`
   - Actualizado: Estado newArticle (fotoArt como File)
   - Nuevo: `handleFotoChange()` con preview
   - Actualizado: `handleCreateArticle()` con FormData
   - Actualizado: `handleCancelCreate()` con limpieza
   - Actualizado: Modal con file input personalizado

5. ✅ `FRONT/src/pages/Seller_view/Inventory/Inventory.styles.css`
   - Nuevos: Estilos para file input y preview

---

**Estado: ✅ IMPLEMENTADO Y LISTO PARA TESTING**

La Solución 1 (MultipartFile) ha sido completamente implementada siguiendo las mejores prácticas de seguridad, UX y manejo de recursos.
