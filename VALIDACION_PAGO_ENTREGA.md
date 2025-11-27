# Validación de Pagos para Entrega de Alquileres

## Descripción
Se ha implementado una validación que **impide entregar un alquiler si no ha sido pagado en su totalidad**. Esta validación se realiza tanto en el frontend como en el backend para mayor seguridad.

## Cambios Realizados

### Backend (Spring Boot)

#### 1. Modelo: `Alquiler.java`
- ✅ Agregado: Relación OneToMany con `Pago`
```java
@OneToMany(mappedBy = "alquiler")
private List<Pago> pagos;
```

#### 2. Servicio: `AlquilerArticuloServiceImplement.java`
- ✅ Inyectado: `PagoService` en el constructor
- ✅ Modificado método: `actualizarEstado()` 
  - Cuando se intenta marcar como entregado (`entregado = true`):
    - Obtiene el total del alquiler
    - Calcula el total pagado usando `PagoService`
    - Compara el total pagado con el total del alquiler
    - Si hay saldo pendiente, lanza `IllegalStateException` con mensaje detallado

#### 3. Controlador: `AlquilerArticuloController.java`
- ✅ Modificado endpoint: `PUT /api/AlquilerArticulos/Actualizar/{idArt}/{idAlq}`
  - Agregado manejo de excepciones
  - Retorna respuesta con status 400 si hay error de validación
  - Retorna JSON con campo "error" describiendo el problema

### Frontend (React)

#### 1. API: `alquilerArticulosApi.js`
- ✅ Mejorado: `marcarArticuloComoEntregado()`
  - Manejo mejorado de errores del servidor
  - Extrae mensajes de error del JSON response

- ✅ Mejorado: `marcarArticuloComoDevuelto()`
  - Manejo mejorado de errores del servidor
  - Extrae mensajes de error del JSON response

#### 2. Componente: `orders.component.jsx`
- ✅ Modificado: `handleMarkAsDelivered()`
  - **Validación doble:**
    1. **Validación en frontend**: Obtiene los pagos del alquiler y verifica que el total pagado >= precio
    2. **Validación en backend**: El servidor revalida también
  - Si hay saldo pendiente, muestra alerta con el monto pendiente
  - Si está pagado, procede a marcar como entregado
  - Manejo mejorado de errores que vienen del backend

- ✅ Mejorado: `handleMarkAsReceived()`
  - Manejo mejorado de errores para devoluciones

## Flujo de Validación

### Cuando el usuario intenta entregar un artículo:

1. **Frontend (Validación local)**
   - Obtiene los pagos del alquiler
   - Suma el total pagado
   - Compara con el precio del artículo
   - Si falta dinero, muestra alerta y cancela
   - Si está pagado, procede

2. **Backend (Validación segura)**
   - Recibe la solicitud de marcar como entregado
   - Obtiene el total del alquiler
   - Obtiene todos los pagos registrados
   - Compara totales
   - Si hay error, retorna error 400 con mensaje descriptivo
   - Si está bien, marca como entregado

## Mensajes de Error

### Ejemplo 1: Entrega sin pagar
```
Alert del Frontend:
"No se puede entregar este artículo. El alquiler tiene un saldo pendiente de $50,000. 
Por favor, realiza el pago completo antes de entregar."
```

### Ejemplo 2: Error de Backend (capturado en frontend)
```
Alert del Frontend:
"No se puede entregar este artículo. El alquiler tiene un saldo pendiente de $30,000. 
Total a pagar: $100,000, Total pagado: $70,000"
```

## Pruebas Recomendadas

1. **Caso 1: Intento sin pago**
   - Crear un alquiler de $100,000
   - No registrar pagos
   - Intentar marcar como entregado
   - ✅ Debe mostrar: "saldo pendiente de $100,000"

2. **Caso 2: Pago parcial**
   - Crear un alquiler de $100,000
   - Registrar pago de $70,000
   - Intentar marcar como entregado
   - ✅ Debe mostrar: "saldo pendiente de $30,000"

3. **Caso 3: Pago completo**
   - Crear un alquiler de $100,000
   - Registrar pago de $100,000
   - Intentar marcar como entregado
   - ✅ Debe permitir la entrega

4. **Caso 4: Pago excesivo**
   - Crear un alquiler de $100,000
   - Registrar pago de $150,000
   - Intentar marcar como entregado
   - ✅ Debe permitir la entrega

## Notas Importantes

- La validación se ejecuta en **ambos lados** (frontend y backend) para máxima seguridad
- El frontend proporciona una **experiencia de usuario rápida**
- El backend proporciona **seguridad** contra manipulaciones
- Los mensajes de error son **descriptivos** para ayudar al usuario
- El sistema es **tolerante** si hay pagos excesivos (permite la entrega)

## Archivos Modificados

```
Backend:
✅ src/main/java/com/sga/project/models/Alquiler.java
✅ src/main/java/com/sga/project/service/AlquilerArticuloServiceImplement.java
✅ src/main/java/com/sga/project/controller/AlquilerArticuloController.java

Frontend:
✅ FRONT/src/api/alquilerArticulosApi.js
✅ FRONT/src/pages/Seller_view/Orders/orders.component.jsx
```
