import { Navigation } from "@/components/Navigation";
import { StatsWidget } from "@/components/StatsWidget";
import { VideosPendientesTable } from "@/components/VideosPendientesTable";
import { VideosAprobadosTable } from "@/components/VideosAprobadosTable";
import spaceBanner from "@/assets/space-banner.jpg";

const General = () => {
  return (
    <div
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${spaceBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Navigation />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
            Panel General - Distribuidor de Instancias
          </h1>
          <p className="text-xl text-muted-foreground">
            Centro de control para gestión de videos y reportes de agentes
          </p>
        </div>

        <StatsWidget />

        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-8 text-center">
              Videos Pendientes
            </h2>
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
    </div>
  );
};

export default General;