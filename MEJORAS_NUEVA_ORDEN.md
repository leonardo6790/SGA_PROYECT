# Mejoras en Nueva Orden - Panel de Pagos y Buscador de Artículos

## Resumen de Cambios

Se han implementado dos grandes mejoras en la página de "Nueva Orden" del módulo de vendedor:

1. **Buscador inteligente de artículos** con autocompletado
2. **Panel de pagos integrado** para registrar pagos antes de confirmar la orden

---

## 1. Buscador Inteligente de Artículos

### Funcionalidad
- Campo de búsqueda que filtra artículos en tiempo real
- Búsqueda por: nombre, talla, color, categoría, descripción
- Dropdown con resultados que muestra:
  - Nombre del artículo
  - Descripción completa (género, talla, color)
  - Precio unitario

### Características
- ✅ Búsqueda instantánea mientras se escribe
- ✅ Resultados en un dropdown desplegable
- ✅ Al hacer clic en un resultado, se selecciona automáticamente
- ✅ Se mantiene el select dropdown como alternativa
- ✅ Interfaz limpia y moderna

### Cómo funciona
1. Usuario escribe en el campo de búsqueda
2. Se filtran los artículos según los criterios
3. Aparece un dropdown con los resultados
4. Al hacer clic en un resultado, se selecciona y se limpia el búsqueda
5. Usuario puede agregar el artículo al pedido

### Código modificado
**Archivo:** `New_order.component.jsx`

Estados agregados:
```javascript
const [searchTerm, setSearchTerm] = useState("");
const [showSearchResults, setShowSearchResults] = useState(false);
const [filteredProducts, setFilteredProducts] = useState([]);
```

Funciones:
- `handleSearchChange()` - Filtra productos por búsqueda
- `handleSelectFromSearch()` - Selecciona un producto del resultado
- `closeSearchResults()` - Cierra el dropdown de resultados

---

## 2. Panel de Pagos Integrado

### Funcionalidad
- Registro de pagos directamente en el panel de nueva orden
- Visualización en tiempo real de:
  - Total a pagar
  - Total pagado
  - Saldo pendiente
- Historial de pagos registrados

### Características
- ✅ Panel expandible/colapsable
- ✅ Campos de entrada para montos de pago
- ✅ Validaciones automáticas
- ✅ Historial visual de pagos
- ✅ Opción de eliminar pagos registrados
- ✅ Resumen de totales actualizado en tiempo real
- ✅ Los pagos se guardan automáticamente en la BD al crear la orden

### Interfaz
El panel incluye:
1. **Header desplegable** con título y botón para expandir/contraer
2. **Resumen de totales** en tres columnas:
   - Total a Pagar (cantidad total del alquiler)
   - Total Pagado (suma de todos los pagos registrados)
   - Saldo Pendiente (diferencia)
3. **Formulario de pago**:
   - Input de monto
   - Botón para registrar pago
4. **Historial de pagos**:
   - Lista de pagos registrados
   - Monto y fecha de cada pago
   - Botón para eliminar pagos

### Validaciones
- ✅ Solo permite montos válidos (mayores a 0)
- ✅ No permite pagar más del saldo pendiente
- ✅ Se deshabilita cuando el saldo es 0
- ✅ Valida que no haya dinero pendiente antes de crear la orden (en la página de órdenes)

### Flujo de Pagos
1. **Crear Orden** → Se crea el alquiler en la BD
2. **Registrar Pagos** → Se registran los pagos localmente en el formulario
3. **Guardar y Enviar** → Al confirmar, se guardan:
   - El alquiler (si no existe)
   - Los pagos registrados (si existen)

### Código modificado
**Archivo:** `New_order.component.jsx`

Estados agregados:
```javascript
const [showPaymentPanel, setShowPaymentPanel] = useState(false);
const [paymentAmount, setPaymentAmount] = useState("");
const [registeredPayments, setRegisteredPayments] = useState([]);
const [loadingPayment, setLoadingPayment] = useState(false);
```

Funciones:
- `calculateTotal()` - Calcula el total del alquiler
- `calculateTotalPaid()` - Calcula el total pagado
- `calculateBalance()` - Calcula el saldo pendiente
- `handleAddPayment()` - Agrega un pago a la lista
- `handleDeletePayment()` - Elimina un pago de la lista

Modificación en `handleSendOrder()`:
- Después de crear el alquiler, itera sobre los pagos registrados
- Los guarda en la BD usando `crearPago()`
- Formato de fecha: `yyyyMMdd`

---

## Estilos CSS Agregados

**Archivo:** `New_order.styles.css`

Nuevas clases:
- `.search-container` - Contenedor del buscador
- `.search-input` - Campo de entrada de búsqueda
- `.search-results` - Dropdown de resultados
- `.search-result-item` - Elemento individual en resultados
- `.search-no-results` - Mensaje cuando no hay resultados
- `.result-*` - Clases para partes del resultado (nombre, desc, precio)
- `.payment-panel` - Contenedor principal del panel
- `.payment-header` - Header del panel
- `.payment-content` - Contenido del panel
- `.payment-summary` - Grid de resumen de totales
- `.payment-form` - Formulario de pago
- `.payment-*` - Clases para elementos del formulario
- `.payments-history` - Sección de historial
- `.payment-item` - Elemento de pago en historial

---

## API Utilizadas

### Nuevas Importaciones
```javascript
import { crearPago } from "../../../api/pagoApi";
```

### Endpoints usados
- `crearPago(pagoData)` - Para guardar los pagos en la BD

---

## Archivos Modificados

```
✅ FRONT/src/pages/Seller_view/New_order/New_order.component.jsx
✅ FRONT/src/pages/Seller_view/New_order/New_order.styles.css
```

---

## Pruebas Recomendadas

### Test 1: Buscador de Artículos
1. Ir a Nueva Orden
2. En el campo de búsqueda, escribir el nombre de un vestido
3. Verificar que aparezca en el dropdown
4. Buscar por talla (ej: "M", "L")
5. Buscar por color (ej: "rojo", "azul")
6. Verificar que al hacer clic en un resultado se selecciona

### Test 2: Panel de Pagos
1. Crear una nueva orden con artículos por $100,000
2. Expandir el panel de pagos
3. Verificar que muestre: Total=$100,000, Pagado=$0, Saldo=$100,000
4. Registrar pago de $50,000
5. Verificar que actualice: Pagado=$50,000, Saldo=$50,000
6. Registrar pago de $50,000 más
7. Verificar que el panel se deshabilite (Saldo=0)
8. Intentar registrar pago de $60,000 (debe mostrar error)
9. Eliminar un pago y verificar que se actualice
10. Guardar la orden y verificar que los pagos se guardan en BD

### Test 3: Integraciones
1. Crear orden con búsqueda de artículos
2. Registrar pagos
3. Guardar orden
4. Ir a Órdenes
5. Verificar que se muestren los pagos registrados

---

## Notas Importantes

- El panel de pagos es **expandible** por defecto para mantener la interfaz limpia
- Los pagos se guardan **después** de crear el alquiler
- Si falla el guardado de pagos, **no bloquea** la creación del alquiler
- El búsqueda es **case-insensitive** y busca en múltiples campos
- Los totales se recalculan **en tiempo real**
- Diseño **responsive** para dispositivos móviles

---

## Mejoras Futuras (Opcionales)

1. Agregar filtros adicionales (por estado, disponibilidad)
2. Mostrar imagen del artículo en el resultado de búsqueda
3. Guardar búsquedas recientes
4. Exportar el resumen de la orden en PDF
5. Integrar método de pago (PSE, TC)
6. Historial de cambios de precios
