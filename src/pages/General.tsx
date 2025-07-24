import { Navigation } from "@/components/Navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { VideosPendientesTable } from "@/components/VideosPendientesTable";
import { VideosAprobadosTable } from "@/components/VideosAprobadosTable";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import spaceBanner from "@/assets/space-banner.jpg";
const General = () => {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background relative overflow-hidden" style={{
        backgroundImage: `url(${spaceBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10 overflow-auto">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm flex-shrink-0">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <div className="max-w-full mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
        <div className="space-y-16">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent text-center flex-1">
                Videos Pendientes
              </h2>
              <Button onClick={() => navigate("/")} className="ml-4">
                + Nuevo Video
              </Button>
            </div>
            <VideosPendientesTable />
          </div>

          <div>
            <h2 className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-8 text-center">
              Videos Aprobados
            </h2>
            <VideosAprobadosTable />
          </div>
        </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                ✨ Gestión centralizada de contenido ✨
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
export default General;