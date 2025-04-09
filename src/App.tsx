
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseProvider } from "./contexts/SupabaseContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/user/UserDashboard";
import CreateEvent from "./pages/user/CreateEvent";
import UpcomingEvents from "./pages/user/UpcomingEvents";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingEvents from "./pages/admin/PendingEvents";
import AllEvents from "./pages/admin/AllEvents";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Auth protected route component
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectPath = "/login" 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requireAdmin && user.email !== "prithvimaniar25@gmail.com") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Root route with Index component */}
              <Route path="/" element={<Index />} />
              
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* User routes */}
              <Route path="/user/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/create-event" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/user/upcoming-events" element={
                <ProtectedRoute>
                  <UpcomingEvents />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/pending-events" element={
                <ProtectedRoute requireAdmin={true}>
                  <PendingEvents />
                </ProtectedRoute>
              } />
              <Route path="/admin/all-events" element={
                <ProtectedRoute requireAdmin={true}>
                  <AllEvents />
                </ProtectedRoute>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
