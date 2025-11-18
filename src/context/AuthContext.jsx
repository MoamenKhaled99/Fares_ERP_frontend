import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Simplified Auth for Desktop App
  const [user, setUser] = useState({ name: 'Admin', role: 'super_admin' });

  const login = (username, password) => {
    // Add real auth logic here
    setUser({ name: username, role: 'admin' });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);