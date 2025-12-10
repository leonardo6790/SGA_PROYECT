import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContextDefinition";
import { login as loginApi } from "../api/authApi";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("sga_user");
      const token = localStorage.getItem("sga_token");
      return raw && token ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("sga_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("sga_user");
        localStorage.removeItem("sga_token");
      }
    } catch {
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      console.log("🔐 Intentando login con:", email);
      const response = await loginApi(email, password);
      console.log("📥 Respuesta del backend completa:", response);
      console.log("📝 numDoc recibido:", response.numDoc);
      console.log("📝 Tipo de numDoc:", typeof response.numDoc);
      
      if (response.token) {
        console.log("✅ Token recibido:", response.token.substring(0, 30) + "...");
        
        localStorage.setItem("sga_token", response.token);
        console.log("💾 Token guardado en localStorage");
        
        const userData = {
          numDoc: response.numDoc || null,
          email: response.email,
          rol: response.rol,
          nom1: response.nom1,
          nom2: response.nom2,
          ape1: response.ape1,
          ape2: response.ape2,
          telefono: response.numTel,
          direccion: response.direccion,
          barrio: response.barrio,
          tipoDoc: response.tipoDoc,
          activo: response.activo,
        };
        
        console.log("👤 Datos de usuario a guardar:", userData);
        setUser(userData);
        console.log("👤 Usuario establecido en state");
        
        const tokenGuardado = localStorage.getItem("sga_token");
        console.log("✔️ Verificación - Token existe:", tokenGuardado ? "SÍ" : "NO");
        
        return { ok: true, user: userData };
      }
      
      console.warn("⚠️ No se recibió token del servidor");
      return { ok: false, error: response.mensaje || "Error de autenticación" };
    } catch (error) {
      console.error("❌ Error en login:", error);
      return { ok: false, error: error.message || "Error al conectar con el servidor" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sga_token");
    localStorage.removeItem("sga_user");
    navigate("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
