# 📋 Checklist de Validación - Carga de Fotos

## Pre-Deploy

### Backend
- [ ] Compilar proyecto: `mvn clean compile`
- [ ] Verificar que no haya errores de compilación
- [ ] Directorio existe: `project/src/main/resources/uploads/articulos/`
- [ ] WebConfig.java contiene addResourceHandlers para `/uploads/**`
- [ ] ArticuloController.java tiene endpoint `POST /CrearConFoto`

### Frontend
- [ ] inventory.component.jsx tiene `handleFotoChange` función
- [ ] inventory.component.jsx tiene `handleCreateArticle` con FormData
- [ ] inventory.component.jsx tiene file input en modal
- [ ] Inventory.styles.css tiene estilos para `.file-input-container`
- [ ] No hay errores de sintaxis en JSX

---

## Prueba de Funcionalidad - Parte 1: Setup

1. [ ] Arrancar backend: `mvn spring-boot:run` en puerto 8080
2. [ ] Esperar a que Spring Boot inicie correctamente
3. [ ] Verificar que no haya errores en consola
4. [ ] Arrancar frontend: `npm run dev` en puerto 5173
5. [ ] Verificar que la página carga sin errores
6. [ ] Iniciar sesión como vendedor

---

## Prueba de Funcionalidad - Parte 2: Crear Artículo

### Paso 1: Navegación
- [ ] Ir a "Inventario" desde navbar
- [ ] Página carga correctamente
- [ ] Se muestran artículos existentes
- [ ] Botón "+" visible en esquina inferior

### Paso 2: Abrir Modal
- [ ] Click en botón "+"
- [ ] Modal de "Crear Nuevo Artículo" abre
- [ ] Todos los campos están visibles
- [ ] Campo de foto muestra "Seleccionar foto"

### Paso 3: Seleccionar Imagen
- [ ] Click en "Seleccionar foto"
- [ ] Se abre explorador de archivos
- [ ] Seleccionar imagen (JPG, PNG, WEBP)
- [ ] El label cambia a "Foto seleccionada ✓"
- [ ] Preview de imagen aparece debajo

### Paso 4: Completar Formulario
- [ ] Nombre: "Vestido Rojo"
- [ ] Género: "Dama"
- [ ] Talla: "M"
- [ ] Color: "Rojo"
- [ ] Precio: "50000"
- [ ] Categoría: Seleccionar alguna

### Paso 5: Crear Artículo
- [ ] Click en "Crear Artículo"
- [ ] Modal desaparece
- [ ] No hay errores en consola
- [ ] Artículo nuevo aparece en la lista
- [ ] Imagen del nuevo artículo se muestra correctamente

---

## Prueba de Funcionalidad - Parte 3: Validaciones

### Test 1: Sin Foto
- [ ] Abrir modal
- [ ] NO seleccionar foto
- [ ] Click en "Crear Artículo"
- [ ] Debe mostrar alerta: "Por favor selecciona una foto"
- [ ] Modal se mantiene abierto

### Test 2: Archivo No-Imagen
- [ ] Abrir modal
- [ ] Click en "Seleccionar foto"
- [ ] Intentar seleccionar archivo .txt o .pdf
- [ ] Debe mostrar alerta: "Por favor selecciona un archivo de imagen"
- [ ] Preview no aparece

### Test 3: Cancelar Operación
- [ ] Abrir modal
- [ ] Seleccionar imagen
- [ ] Ver preview
- [ ] Click en "Cancelar"
- [ ] Modal cierra
- [ ] Preview desaparece
- [ ] Próxima vez que abra modal, debe estar vacío

---

## Prueba de Funcionalidad - Parte 4: Persistencia

### Test 1: Imagen en BD
- [ ] Crear artículo con foto (como en Parte 2)
- [ ] Recargar página (F5)
- [ ] Artículo debe seguir visible
- [ ] Imagen debe cargar correctamente

### Test 2: URL de Imagen
- [ ] Inspeccionar elemento <img> del artículo creado
- [ ] src debe ser: `/uploads/articulos/{timestamp}.{ext}`
- [ ] Copiar URL en navegador: `http://localhost:8080/uploads/articulos/{timestamp}.{ext}`
- [ ] Imagen debe mostrarse en navegador

### Test 3: Múltiples Artículos
- [ ] Crear 3 artículos con fotos diferentes
- [ ] Todos deben crearse exitosamente
- [ ] Todas las imágenes deben mostrarse
- [ ] Nombres de archivo en disco deben ser únicos (verificar en carpeta)

---

## Prueba de Rendimiento

### Test 1: Imagen Grande
- [ ] Usar imagen de 5MB+
- [ ] Crear artículo
- [ ] Debe funcionar sin timeout
- [ ] Tiempo de respuesta < 3 segundos

### Test 2: Múltiples Creaciones Rápidas
- [ ] Crear 5 artículos en secuencia rápida
- [ ] Todos deben crearse
- [ ] No debe haber conflictos de nombres
- [ ] No debe haber errores de sincronización

### Test 3: Filtrado
- [ ] Crear artículos en diferentes categorías
- [ ] Filtrar por categoría
- [ ] Imágenes deben cargar correctamente en cada filtro

---

## Verificación de Archivos en Servidor

### Estructura de Directorios
```bash
# En terminal, navegar a:
cd project/src/main/resources/uploads/articulos/

# Debe haber archivos como:
# -rw-r--r--  1 user  group   12345 Dec 15 10:30 1702639200000.jpg
# -rw-r--r--  1 user  group   23456 Dec 15 10:31 1702639201234.png
# -rw-r--r--  1 user  group   34567 Dec 15 10:32 1702639202567.webp
```

### Verificar Formato de URL
```bash
# En base de datos, la columna fotoArt debe tener valores como:
# /uploads/articulos/1702639200000.jpg
# /uploads/articulos/1702639201234.png
```

---

## Browser Console - Esperado

### Al Crear Artículo
```
Estado actual newArticle: {nomArt: "...", generoArt: "...", ...}
FormData a enviar al backend
```

### Respuesta Exitosa
```
Artículo creado exitosamente
(Alerta mostrada al usuario)
```

### En Caso de Error
```
Error al crear el artículo: [Mensaje específico]
```

---

## Problemas Comunes y Soluciones

| Problema | Solución |
|----------|----------|
| "404 en /uploads/..." | Verificar WebConfig.java está compilado |
| "La foto es requerida" | Seleccionar archivo antes de crear |
| "No es un archivo de imagen" | Usar JPG/PNG/WEBP |
| "Error al guardar imagen" | Verificar permisos de carpeta uploads/ |
| "CORS error" | Verificar token en localStorage |

---

## Post-Deploy

- [ ] Documentar URL de acceso a imágenes
- [ ] Configurar backup de carpeta uploads/
- [ ] Monitorear espacio en disco
- [ ] Establecer límite de tamaño de archivo
- [ ] Considerar agregar validación de dimensiones

---

## Notas de Seguridad

✅ **Implementado correctamente:**
- Validación de tipo MIME en cliente
- Validación de archivo en servidor
- Nombres únicos (no sobrescritura)
- Directorio centralizado
- CORS configurado

⚠️ **Consideraciones futuras:**
- Validar tamaño máximo de archivo (< 5MB recomendado)
- Validar dimensiones de imagen
- Implementar rate limiting
- Limpiar imágenes huérfanas (sin artículo asociado)

---

**Última actualización:** 2024-12-15  
**Responsable:** GitHub Copilot  
**Estado:** Lista para validación
