# ⚡ Quick Start - Guía Rápida SGA

## 🚀 Iniciar el Proyecto (3 pasos)

### Terminal 1: Base de Datos
```bash
# Si MySQL no está corriendo, inicia el servicio
# Windows:
net start MySQL80

# Luego ejecuta el setup
mysql -u root -p < "c:\\Users\\VICTUS\\Desktop\\SGA\\project\\setup-database.sql"
```

### Terminal 2: Backend
```bash
cd c:\\Users\\VICTUS\\Desktop\\SGA\\project
mvnw.cmd spring-boot:run
# O simplemente: mvnw spring-boot:run

# Esperado: Server started on port 8080
```

### Terminal 3: Frontend
```bash
cd c:\\Users\\VICTUS\\Desktop\\SGA\\FRONT
npm install  # Solo si es primera vez
npm run dev

# Esperado: Local: http://localhost:5173
```

---

## 🔐 Login Rápido

**URL**: `http://localhost:5173`

### Como Admin
```
Email: admin@ejemplo.com
Password: 123456
```

### Como Vendedor
```
Email: vendedor@ejemplo.com
Password: 123456
```

---

## 📋 Testing Creación de Vendedor

1. Login como Vendedor
2. Click en: Reports → Vendedores
3. Click en botón "+" (Crear Nuevo Vendedor)
4. Llena con datos de prueba:
   ```
   Doc: 1234567890
   Tipo: Cédula de Ciudadanía
   Nombre: TestUser
   Apellido: Testing
   Email: test@ejemplo.com
   Teléfono: 3001234567
   Contraseña: test123
   Barrio: Centro
   ```
5. Abre consola (F12) y verifica logs
6. Click "Enviar"

---

## 🔍 Debugging Rápido

### Ver logs del Frontend
```javascript
// Abre consola (F12) y busca:
console.log  // "Enviando datos del vendedor:"
console.error // "Error del servidor:"
```

### Ver logs del Backend
```bash
# En la terminal de Spring Boot, busca líneas con:
# "[INFO]", "[ERROR]", "Usuario"
```

### Verificar BD
```bash
mysql -u root -p
USE pruebita;
SELECT * FROM usuario LIMIT 5;
SELECT * FROM barrio;
SELECT * FROM tipo_doc;
```

---

## ❌ Problemas Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| **ERR_CONNECTION_REFUSED** | Backend no está corriendo | Ejecuta `mvnw spring-boot:run` |
| **CORS Error** | Frontend/Backend en diferentes puertos | Normal, está configurado |
| **Error 400** | Datos inválidos | Revisa consola (F12) para detalles |
| **Error 401** | Token expirado | Login nuevamente |
| **No se cargan barrios** | BD no tiene datos | Ejecuta `setup-database.sql` |

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `FRONT/src/api/usuariosApi.js` | API calls para usuarios |
| `FRONT/src/pages/Seller_view/Reports/reports.component.jsx` | Componente principal de reports |
| `project/src/main/java/com/sga/project/controller/UsuarioController.java` | Backend endpoint /api/usu/crear |
| `project/setup-database.sql` | Script para inicializar BD |
| `project/src/main/resources/application.properties` | Configuración del backend |

---

## 🔄 Comandos Útiles

### Limpiar y Reinstalar
```bash
# Frontend
cd FRONT
rm -r node_modules package-lock.json
npm install

# Backend
cd project
mvnw clean compile
```

### Compilar sin ejecutar
```bash
cd project
mvnw clean package
# JAR estará en: target/project-0.0.1-SNAPSHOT.jar
```

### Ejecutar JAR compilado
```bash
cd project/target
java -jar project-0.0.1-SNAPSHOT.jar
```

### Ver puertos en uso
```bash
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :5173
netstat -ano | findstr :3306
```

---

## 📊 Estados Esperados

### ✅ Todo está bien cuando:
- Terminal Backend: `Tomcat started on port(s): 8080`
- Terminal Frontend: `Local: http://localhost:5173`
- Consola Browser: Sin errores rojo
- Login: Funciona sin problemas
- Crear Vendedor: Se envía y aparece en lista

### ⚠️ Algo está mal cuando:
- Error CORS en consola
- Error 404 al intentar acceder a API
- Error 500 en backend
- Token no se guarda en localStorage

---

## 💾 Datos de Prueba Recomendados

```javascript
{
  numDocumento: 1234567890,
  nombre1: "TestUser",
  apellido1: "Testing",
  correoElectronico: "test@ejemplo.com",
  tele: 3001234567,
  contra: "Test123!",
  idBarrio: 1,
  idTipoDoc: 1
}
```

---

## 🎯 Flujo Típico de Testing

1. **Setup** (5 min)
   - Inicia 3 terminales
   - Verifica que todo esté en puertos correctos

2. **Login** (2 min)
   - Abre frontend en navegador
   - Login como vendedor
   - Verifica que token esté en localStorage

3. **Crear Vendedor** (5 min)
   - Navega a Reports
   - Abre formulario
   - Completa datos
   - Abre F12 y verifica logs
   - Envía formulario

4. **Validar** (3 min)
   - Verifica en tabla que aparezca nuevo vendedor
   - Verifica en BD que se insertó
   - Verifica que contraseña está encriptada

5. **Debugging** (si hay errores)
   - Revisa consola (F12)
   - Revisa logs de backend
   - Revisa error específico del servidor

---

## 🔐 Seguridad Básica

- ✅ Contraseñas encriptadas con BCrypt
- ✅ JWT válida por 24 horas
- ✅ CORS configurado para localhost
- ⚠️ En producción: Usar HTTPS y variables de entorno

---

## 📞 Soporte Rápido

**Si hay error 400**:
1. Abre F12 → Console
2. Busca "Error del servidor:"
3. Lee el mensaje específico
4. Corrige el campo indicado

**Si hay error 500**:
1. Revisa logs de Spring Boot
2. Verifica que BD esté corriendo
3. Verifica que setup-database.sql se ejecutó

**Si no se cargan datos**:
1. Verifica token en localStorage (F12 → Application → Local Storage)
2. Verifica que barrios y tipos se carguen en dropdown
3. Revisa que API devuelva datos (F12 → Network)

---

**Última actualización**: Sesión actual  
**Status**: ✅ Listo para testing  
**Tiempo estimado para todo**: 15-20 minutos
