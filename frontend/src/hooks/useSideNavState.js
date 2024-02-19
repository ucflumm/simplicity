import { createContext, useContext, useState, useMemo } from 'react';

// Create a context for the SideNav state
const SideNavStateContext = createContext();

// Provider component that wraps your app or component tree
export const SideNavStateProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const value = useMemo(() => ({ collapsed, setCollapsed }), [collapsed]);

  return (
    <SideNavStateContext.Provider value={value}>
      {children}
    </SideNavStateContext.Provider>
  );
};

// Hook for accessing the SideNav state
export const useSideNavState = () => {
  const context = useContext(SideNavStateContext);
  if (context === undefined) {
    throw new Error('useSideNavState must be used within a SideNavStateProvider');
  }
  return context;
};
