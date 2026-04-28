import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock user data - skip all authentication checks
  const [user] = useState({ 
    id: 'mock-user-id',
    email: 'dev@example.com',
    name: 'Developer'
  });
  const [isAuthenticated] = useState(true);
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);
  const [authChecked] = useState(true);
  const [appPublicSettings] = useState({ 
    id: 'mock-app-id',
    public_settings: {}
  });

  // Mock functions
  const logout = () => {
    console.log('Mock logout - implement later with Supabase');
  };

  const navigateToLogin = () => {
    console.log('Mock navigate to login - implement later');
  };

  const checkUserAuth = async () => {
    return true;
  };

  const checkAppState = async () => {
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
