import React, { createContext, useState, useContext } from 'react';
import { SpinnerLoader } from '../components/moleculas/SpinnerLoader';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, setIsLoading, setLoadingText }}>
      {isLoading && <SpinnerLoader />}
      {!isLoading && children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
