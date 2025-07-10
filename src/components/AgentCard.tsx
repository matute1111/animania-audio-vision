import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AgentCardProps {
  name: string;
  icon: string;
  status: "active" | "pending" | "error";
  lastExecution: string;
  nextExecution: string;
}

const statusConfig = {
  active: {
    emoji: "🟢",
    label: "Activo",
    variant: "default" as const,
  },
  pending: {
    emoji: "🟡",
    label: "Pendiente",
    variant: "secondary" as const,
  },
  error: {
    emoji: "🔴",
    label: "Error",
    variant: "destructive" as const,
  },
};

export const AgentCard = ({
  name,
  icon,
  status,
  lastExecution,
  nextExecution,
}: AgentCardProps) => {
  const statusInfo = statusConfig[status];

  const handleViewReport = () => {
    toast({
      title: "Próximamente",
      description: `Informe de ${name} estará disponible pronto.`,
    });
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            {name}
          </CardTitle>
          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
            <span>{statusInfo.emoji}</span>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Última ejecución:</span>
            <span className="text-foreground font-medium">{lastExecution}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Próxima:</span>
            <span className="text-foreground font-medium">{nextExecution}</span>
          </div>
        </div>
        <Button
          onClick={handleViewReport}
          className="w-full"
          variant="outline"
        >
          Ver Informe
        </Button>
      </CardContent>
    </Card>
  );
};