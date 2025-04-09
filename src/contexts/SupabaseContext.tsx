
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Display message for demo purposes - this would be replaced with actual Supabase credentials
    console.log('🔥 Note: For this app to work, you need to connect it to a Supabase project.');
    console.log('👉 Click on the green Supabase button in the top right of Lovable interface.');
    
    try {
      // In Lovable, when connected to Supabase, these values would be automatically filled in
      // For now we'll attempt to initialize with empty values for demonstration
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabase(client);
      } else {
        // For demo purposes, we'll show a toast when Supabase isn't connected
        toast.error("This app needs to be connected to Supabase to function properly", {
          description: "Click the green Supabase button in Lovable to connect.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
};
