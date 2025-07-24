import { Navigation } from "@/components/Navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { StatsWidget } from "@/components/StatsWidget";
import { AgentCard } from "@/components/AgentCard";
import { PendingUploadsTable } from "@/components/PendingUploadsTable";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import spaceBanner from "@/assets/space-banner.jpg";

const agents = [
  {
    name: "PERFORMANCE",
    icon: "📊",
    status: "active" as const,
    lastExecution: "08/07/2025 - 8:00 AM",
    nextExecution: "Lunes 8:00 AM",
  },
  {
    name: "SEO DIARIO",
    icon: "🔍",
    status: "active" as const,
    lastExecution: "09/07/2025 - 8:00 PM",
    nextExecution: "Diario 8:00 PM",
  },
  {
    name: "AUDIENCIA & ENGAGEMENT",
    icon: "👥",
    status: "pending" as const,
    lastExecution: "04/07/2025 - 2:00 PM",
    nextExecution: "Viernes 2:00 PM",
  },
];

const Agents = () => {
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
          
          <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Navigation />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
            Agentes AI - Hub Intergaláctico
          </h1>
        </div>

        <StatsWidget />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <AgentCard
              key={index}
              name={agent.name}
              icon={agent.icon}
              status={agent.status}
              lastExecution={agent.lastExecution}
              nextExecution={agent.nextExecution}
            />
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-8 text-center">
            Pendientes a Subir
          </h2>
          <PendingUploadsTable />
        </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                ✨ Automatización inteligente para tu canal ✨
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Agents;