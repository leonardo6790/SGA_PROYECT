# 📱 INSTRUCCIONES PARA EJECUTAR EN ANDROID STUDIO

## 🎯 Opción 1: Ejecutar con Expo Go (MÁS FÁCIL)

### Paso 1: Instalar Expo Go
1. Abre **Google Play Store** en tu celular
2. Busca "**Expo Go**"
3. Instala la aplicación

### Paso 2: Iniciar el servidor
En PowerShell, ejecuta:
```powershell
cd C:\Users\SENA\Desktop\sga\appMovile\SGAMobile
npm start
```

### Paso 3: Escanear QR
1. Abre **Expo Go** en tu celular
2. Toca "**Scan QR Code**"
3. Apunta la cámara al código QR que aparece en la terminal
4. ¡Listo! La app se cargará

---

## 🎯 Opción 2: Ejecutar en Emulador de Android Studio

### Paso 1: Verificar Android Studio
1. Abre **Android Studio**
2. Ve a **Tools → Device Manager** (o AVD Manager)

### Paso 2: Crear/Iniciar Emulador
1. Si no tienes un emulador:
   - Click en "**Create Device**"
   - Selecciona "**Pixel 5**" o similar
   - Selecciona "**API 33**" o superior
   - Click "**Finish**"

2. Click en el botón **▶️ Play** junto al emulador
3. Espera a que el emulador inicie completamente (hasta ver la pantalla de inicio)

### Paso 3: Ejecutar la App
En PowerShell (en la carpeta del proyecto):
```powershell
npm run android
```

O simplemente presiona la tecla **`a`** en la terminal donde está corriendo Expo

---

## 🎯 Opción 3: Dispositivo Físico (WiFi)

### Requisitos:
- Tu PC y celular deben estar en la **misma red WiFi**
- Necesitas cambiar la configuración de IP

### Paso 1: Encontrar tu IP
En PowerShell:
```powershell
ipconfig
```
Busca "**IPv4 Address**" (ejemplo: 192.168.1.100)

### Paso 2: Configurar la App
1. Edita: `src/utils/constants.ts`
2. Cambia:
```typescript
export const API_BASE_URL = 'http://TU_IP_LOCAL:8080/api';
// Ejemplo: 'http://192.168.1.100:8080/api'
```

### Paso 3: Ejecutar
```powershell
npm start
```
Escanea el QR con Expo Go

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### ❌ "Metro Bundler no puede conectarse"
**Solución:**
```powershell
npm start -- --clear
```

### ❌ "No device connected"
**Solución:**
1. Verifica que el emulador esté completamente iniciado
2. Ejecuta: `adb devices` para ver dispositivos conectados
3. Si no aparece nada, reinicia el emulador

### ❌ "Cannot connect to backend"
**Solución:**
1. Verifica que el backend esté corriendo en http://localhost:8080
2. Si usas emulador, la URL debe ser: `http://10.0.2.2:8080/api`
3. Si usas dispositivo físico, usa tu IP local

### ❌ "INSTALL_FAILED_INSUFFICIENT_STORAGE"
**Solución:**
1. Abre Android Studio → AVD Manager
2. Edita tu emulador
3. Aumenta el espacio de almacenamiento a al menos 2GB

---

## 📊 VERIFICAR QUE TODO FUNCIONA

### ✅ Checklist:
- [ ] Node.js instalado (verifica: `node --version`)
- [ ] npm funcionando (verifica: `npm --version`)
- [ ] Backend corriendo en http://localhost:8080
- [ ] Expo server iniciado (`npm start`)
- [ ] Emulador de Android o Expo Go instalado
- [ ] Puedes ver el código QR en la terminal

---

## 🎉 COMANDOS ÚTILES

```powershell
# Iniciar servidor de desarrollo
cd C:\Users\SENA\Desktop\sga\appMovile\SGAMobile
npm start

# Ejecutar en Android (emulador debe estar abierto)
npm run android

# Limpiar caché y reiniciar
npm start -- --clear

# Ver dispositivos conectados
adb devices

# Instalar dependencias (si hay problemas)
npm install

# Actualizar dependencias de Expo
npx expo install --fix
```

---

## 📞 INFORMACIÓN DE DEBUG

### Logs en tiempo real:
Los logs aparecen automáticamente en la terminal cuando la app está corriendo

### Abrir DevTools:
- En la app: Agita el dispositivo o presiona `Ctrl+M` (emulador)
- En la terminal: Presiona `j` para abrir debugger

### Recargar la app:
- Presiona `r` en la terminal
- O agita el dispositivo → "Reload"

---

## 🎯 ESTADO ACTUAL

✅ **Proyecto creado y configurado**
✅ **Servidor de Expo funcionando**
✅ **Listo para ejecutar en Android**

### Siguiente paso:
1. Abre Android Studio y un emulador
2. Ejecuta: `npm run android`
3. ¡Disfruta tu app!

---

**¿Necesitas ayuda?** Revisa la GUIA-RAPIDA.md o README.md
