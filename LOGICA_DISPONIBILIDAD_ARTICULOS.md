# 📋 Lógica de Disponibilidad de Artículos - Sistema Completo

## 🎯 Flujo Implementado

### 1️⃣ **Crear Alquiler** (Estado: Artículos NO disponibles)
Cuando se crea un nuevo alquiler:
- ✅ Los artículos seleccionados se marcan como `activo = false`
- ✅ Se crea la relación `AlquilerArticulos` con:
  - `estado = false` (no devuelto)
  - `entregado = false` (no entregado al cliente)
- ✅ Los artículos **NO aparecen** en la lista de disponibles para nuevos alquileres

**Endpoint Backend:** `POST /api/alquiler/CrearAlquiler`
**Frontend:** `crearAlquiler()` en `alquilerApi.js`

---

### 2️⃣ **Entregar Orden al Cliente** (Estado: Entregado pero NO disponible)
Cuando se entrega el pedido al cliente:
- ✅ Se marca `entregado = true` en `AlquilerArticulos`
- ⚠️ Los artículos permanecen como `activo = false`
- ❌ Los artículos **NO aparecen** aún en la lista de disponibles

**Endpoint Backend:** `PUT /api/alquiler/entregar/{id}`
**Frontend:** `marcarComoEntregado(id)` en `alquilerApi.js`

**Uso en Frontend:**
```javascript
import { marcarComoEntregado } from '../api/alquilerApi';

const handleEntregar = async (alquilerId) => {
  try {
    await marcarComoEntregado(alquilerId);
    alert("Orden marcada como entregada al cliente");
  } catch (error) {
    alert("Error al marcar como entregada");
  }
};
```

---

### 3️⃣ **Recibir Devolución** (Estado: Artículos DISPONIBLES nuevamente)
Cuando el cliente devuelve los artículos:
- ✅ Se marca `estado = true` en `AlquilerArticulos` (devuelto)
- ✅ Se marca `activo = true` en `Articulo` (disponible)
- ✅ Los artículos **VUELVEN a aparecer** en la lista de disponibles

**Endpoint Backend:** `PUT /api/alquiler/devolver/{id}`
**Frontend:** `marcarComoDevuelto(id)` en `alquilerApi.js`

**Uso en Frontend:**
```javascript
import { marcarComoDevuelto } from '../api/alquilerApi';

const handleDevolver = async (alquilerId) => {
  try {
    await marcarComoDevuelto(alquilerId);
    alert("Artículos devueltos y disponibles para alquilar nuevamente");
  } catch (error) {
    alert("Error al marcar como devuelto");
  }
};
```

---

## 📊 Estados de los Artículos

### Tabla de Estados

| Estado del Alquiler | `AlquilerArticulos.entregado` | `AlquilerArticulos.estado` | `Articulo.activo` | ¿Aparece en lista? |
|---------------------|------------------------------|---------------------------|------------------|-------------------|
| Alquiler creado     | false                        | false                     | false            | ❌ NO             |
| Entregado a cliente | true                         | false                     | false            | ❌ NO             |
| Devuelto por cliente| true                         | true                      | true             | ✅ SÍ             |

---

## 🔧 Cambios Implementados

### Backend (Java/Spring Boot)

#### 1. **AlquilerServiceImplement.java**
```java
// Al crear alquiler - marcar artículos como NO disponibles
articulo.setActivo(false);
articuloRepo.save(articulo);

// Al entregar - marcar como entregado
aa.setEntregado(true);
alquiArtiRepo.save(aa);

// Al devolver - marcar artículos como disponibles
aa.setEstado(true);
articulo.setActivo(true);
articuloRepo.save(articulo);
```

#### 2. **ArticuloServiceImplement.java**
```java
// Solo mostrar artículos disponibles
public List<ArticuloDto> getListArticulos() {
    return artiRepo.findAll().stream()
        .filter(articulo -> articulo.getActivo() != null && articulo.getActivo())
        .map(artiMap::toArticuloDto)
        .toList();
}
```

#### 3. **AlquilerController.java**
Nuevos endpoints:
- `PUT /api/alquiler/entregar/{id}` - Marcar como entregado
- `PUT /api/alquiler/devolver/{id}` - Marcar como devuelto y liberar artículos

### Frontend (React)

#### 1. **alquilerApi.js**
Nuevas funciones:
```javascript
export const marcarComoEntregado = async (id) => {...}
export const marcarComoDevuelto = async (id) => {...}
```

---

## 💡 Ejemplo de Uso Completo

### En la Pantalla de Órdenes

```javascript
import { marcarComoEntregado, marcarComoDevuelto } from '../api/alquilerApi';

const OrdenesScreen = () => {
  const [ordenes, setOrdenes] = useState([]);

  const handleEntregar = async (idAlquiler) => {
    if (window.confirm("¿Confirmar entrega al cliente?")) {
      try {
        await marcarComoEntregado(idAlquiler);
        alert("✅ Artículos entregados al cliente");
        // Recargar órdenes
        cargarOrdenes();
      } catch (error) {
        alert("❌ Error al marcar como entregado: " + error.message);
      }
    }
  };

  const handleDevolver = async (idAlquiler) => {
    if (window.confirm("¿Confirmar devolución de artículos?")) {
      try {
        await marcarComoDevuelto(idAlquiler);
        alert("✅ Artículos devueltos y disponibles para alquilar nuevamente");
        // Recargar órdenes
        cargarOrdenes();
      } catch (error) {
        alert("❌ Error al marcar como devuelto: " + error.message);
      }
    }
  };

  return (
    <div>
      {ordenes.map(orden => (
        <div key={orden.id_alquiler}>
          <h3>Orden #{orden.id_alquiler}</h3>
          {!orden.entregado && (
            <button onClick={() => handleEntregar(orden.id_alquiler)}>
              Marcar como Entregado
            </button>
          )}
          {orden.entregado && !orden.devuelto && (
            <button onClick={() => handleDevolver(orden.id_alquiler)}>
              Marcar como Devuelto
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## ✅ Validaciones Implementadas

1. **Al crear alquiler:**
   - Verifica que los artículos estén disponibles (`activo = true`)
   - Lanza excepción si el artículo no está disponible

2. **Al listar artículos:**
   - Solo muestra artículos con `activo = true`
   - Los artículos alquilados NO aparecen

3. **Al devolver:**
   - Marca artículos como devueltos
   - Restaura disponibilidad automáticamente

---

## 🚀 Próximos Pasos

Para una interfaz completa, necesitas agregar:

1. **Botones de Entregar/Devolver** en la pantalla de órdenes
2. **Indicadores visuales** del estado de cada orden
3. **Filtros** para ver órdenes por estado (pendientes, entregadas, devueltas)
4. **Historial** de movimientos de cada artículo

---

## 📝 Resumen

✅ **Artículos se ocultan** cuando se crea un alquiler  
✅ **Artículos permanecen ocultos** cuando se entrega al cliente  
✅ **Artículos vuelven a aparecer** cuando se recibe la devolución  
✅ **Sistema completo** implementado en backend y frontend  
✅ **Validaciones** para prevenir alquilar artículos no disponibles  

🎉 **¡Sistema de disponibilidad completamente funcional!**
