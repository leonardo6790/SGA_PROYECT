import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate ? useNavigate() : null;
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("sga_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem("sga_user", JSON.stringify(user));
      else localStorage.removeItem("sga_user");
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  const login = ({ email, password }) => {
    // Fixed credentials as requested
    const validEmail = "miguel@paludo.co";
    const validPassword = "DePerrito";

    if (email === validEmail && password === validPassword) {
      const u = { email: validEmail, name: "Miguel" };
      setUser(u);
      return { ok: true, user: u };
    }

    return { ok: false, error: "Credenciales inválidas" };
  };

  const logout = () => {
    setUser(null);
    if (navigate) navigate("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
