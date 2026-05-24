import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const logout = () => {
    console.log("Admin logged out");
    // Implement any actual logout logic if needed
  };

  return (
    <AdminContext.Provider value={{ logout, isEditMode, setIsEditMode }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
