# ⚡ VERIFICACIÓN RÁPIDA

## Paso 1: Asegúrate de que el backend está compilado ✅
```bash
cd c:\Users\VICTUS\Desktop\SGA\project
mvnw.cmd clean compile
```

## Paso 2: Reinicia Spring Boot
- Si está ejecutándose, presiona `Ctrl+C` para detenerlo
- Luego ejecuta nuevamente para que cargue el código compilado

## Paso 3: Abre el navegador
1. Ve a tu aplicación
2. Navega a **Reportes > Vendedores**
3. Abre la consola (F12 > Console)

## Paso 4: Verifica los logs
Deberías ver algo como esto en la consola:
```
Filtrando vendedores de: Array(5)
Total de usuarios: 5
Usuario: David Leonardo Bautista, idRol: 2, tipo: number
Usuario: Juan Pérez, idRol: 2, tipo: number
Usuario: María García, idRol: 2, tipo: number
...
Vendedores filtrados: Array(3)
```

## Resultado Esperado
- La tabla de vendedores debe mostrar **todos los vendedores**, no solo 1
- El número de filas debe coincidir con el número de usuarios con `idRol = 2`

## Si No Funciona
1. Verifica que el backend esté compilado: `mvnw.cmd clean compile -q`
2. Verifica que Spring Boot se reinició después de compilar
3. Limpia el caché del navegador: Ctrl+Shift+Delete
4. Recarga con Ctrl+F5

---

## Debug Rápido en BD

Si quieres verificar cuántos vendedores debería haber:
```sql
SELECT COUNT(*) as total_vendedores FROM USUARIOS WHERE id_rol = 2;
```

La tabla en el navegador debe mostrar ese mismo número.
