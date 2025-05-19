import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/admin/me', { withCredentials: true }); // you'll add this route
        setIsAuthenticated(true);
        setUser(res.data.user); // assuming you return user in response
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);
  
  const login = ({user}) => {
    setIsAuthenticated(true);
    setUser(user)
  };

  const logout = async () => {
    try {
      // Call the backend API endpoint for logout
      await axios.post('/api/admin/logout', {}, { withCredentials: true });
      
      // Update state after successful logout
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear the frontend state even if the API call fails
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user , loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};