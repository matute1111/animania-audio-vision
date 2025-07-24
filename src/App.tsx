
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import General from "./pages/General";
import Login from "./pages/Login";
import EditMetadata from "./pages/EditMetadata";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/general" replace /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/agents" 
        element={
          <ProtectedRoute>
            <Agents />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/general" 
        element={
          <ProtectedRoute>
            <General />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-metadata/:id" 
        element={
          <ProtectedRoute>
            <EditMetadata />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/index" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
