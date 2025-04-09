
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseContext';
import { toast } from 'sonner';

// Types
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { supabase, isLoading: isSupabaseLoading } = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    if (!supabase || isSupabaseLoading) return;

    // Set up session listener
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error getting auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();
  }, [supabase, isSupabaseLoading]);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      toast.error("Supabase client not initialized");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast.success("Sign-up successful!", { description: "You can now log in with your new account." });
    } catch (error: any) {
      toast.error("Sign-up failed", { description: error.message });
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      toast.error("Supabase client not initialized");
      return;
    }

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Admin check and redirect
      if (email === "meowmeow@meow.com") {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }

      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error("Login failed", { description: error.message });
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    if (!supabase) {
      toast.error("Supabase client not initialized");
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Sign-out failed", { description: error.message });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      isLoading: isLoading || isSupabaseLoading,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
