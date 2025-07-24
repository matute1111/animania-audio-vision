import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import spaceBanner from "@/assets/space-banner.jpg";

const NuevoVideo = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background relative" style={{
        backgroundImage: `url(${spaceBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
                Crear Nuevo Video
              </h1>
              <p className="text-muted-foreground">
                Configuración para generar un nuevo video
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Configuración del Video</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Próximamente: Formulario para crear nuevo video
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NuevoVideo;