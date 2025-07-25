
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import General from "./pages/General";
import EditMetadata from "./pages/EditMetadata";
import Login from "./pages/Login";
import NuevoGuion from "./pages/NuevoGuion";
import NuevoAudio from "./pages/NuevoAudio";
import NuevoVideo from "./pages/NuevoVideo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/general" element={<General />} />
            <Route path="/nuevo-guion" element={<NuevoGuion />} />
            <Route path="/nuevo-audio" element={<NuevoAudio />} />
            <Route path="/nuevo-video" element={<NuevoVideo />} />
            <Route path="/edit-metadata/:id" element={<EditMetadata />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
