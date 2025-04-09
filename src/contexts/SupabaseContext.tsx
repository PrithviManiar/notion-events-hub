
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Context type definition
type SupabaseContextType = {
  supabase: SupabaseClient | null;
  isLoading: boolean;
};

// Create context
const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isLoading: true,
});

// Custom hook for using the Supabase context
export const useSupabase = () => useContext(SupabaseContext);

// Provider component
export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Supabase client
    try {
      console.log('Supabase client initialized');
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      toast.error("Error connecting to database", {
        description: "Please make sure your Supabase project is properly configured.",
        duration: 5000,
      });
      setIsLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};
