# Instalación de Dependencias para Subida de Fotos

Para que funcione la subida de fotos en la app móvil, necesitas instalar las siguientes dependencias:

## 1. Expo Image Picker
```bash
npx expo install expo-image-picker
```

## 2. React Native Picker (si no está instalado)
```bash
npm install @react-native-picker/picker
```

## 3. AsyncStorage (si no está instalado)
```bash
npx expo install @react-native-async-storage/async-storage
```

## Uso
Una vez instaladas las dependencias, la app móvil podrá:
- Seleccionar fotos de la galería
- Tomar fotos con la cámara
- Subir fotos al servidor usando FormData (mismo formato que la web)

## Permisos
La app solicitará automáticamente los permisos necesarios para:
- Acceder a la galería de fotos
- Usar la cámara

## Pantalla de Agregar Artículo
- Navega desde el botón "+" en la pantalla de Inventario
- Completa los campos del formulario
- Selecciona una foto (obligatorio)
- Crea el artículo

El artículo se creará usando el mismo endpoint que la web: `/api/articulos/CrearConFoto`
