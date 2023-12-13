import React,{createContext, useState, useContext} from "react";
const AuthContext = createContext();

// Создаем провайдер контекста
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  const setAuthData = (newToken, newUsername) => {
    const CurrentToken = newToken || token;
    setToken(CurrentToken);
    setUsername(newUsername);
  };


    return (
    <AuthContext.Provider value={{ token, username, setAuthData }}>
        {children}
    </AuthContext.Provider>
    );

};

// Создаем хук для использования контекста
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };