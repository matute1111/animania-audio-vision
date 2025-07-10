import { Navigation } from "@/components/Navigation";
import { StatsWidget } from "@/components/StatsWidget";
import { AgentCard } from "@/components/AgentCard";
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
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

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Automatización inteligente para tu canal ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Agents;