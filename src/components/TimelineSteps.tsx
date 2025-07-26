import { useLocation } from "react-router-dom";
import { FileText, Volume2, Image, Sliders, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  disabled?: boolean;
}

const steps: Step[] = [
  {
    id: "guion",
    title: "Guión",
    icon: FileText,
    path: "/nuevo-guion",
  },
  {
    id: "audio",
    title: "Audio", 
    icon: Volume2,
    path: "/nuevo-audio",
  },
  {
    id: "imagen",
    title: "Imagen",
    icon: Image,
    path: "/nuevo-video",
  },
  {
    id: "post-produccion",
    title: "Post Producción",
    icon: Sliders,
    path: "/post-produccion",
    disabled: true,
  },
];

export function TimelineSteps() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.path === currentPath);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <TooltipProvider>
      <div className="mb-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-3 text-center">
            Proceso de Creación de Video
          </h3>
          
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/30 -z-10">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ 
                  width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%' 
                }}
              />
            </div>

            {steps.map((step, index) => {
              const isActive = step.path === currentPath;
              const isCompleted = index < currentStepIndex;
              const Icon = step.icon;
              
              if (step.disabled) {
                return (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center group cursor-help">
                        <div className={`
                          w-8 h-8 rounded-full border-2 flex items-center justify-center
                          transition-all duration-300 bg-muted/50 border-border/50
                          opacity-60
                        `}>
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-medium mt-1 text-muted-foreground">
                          {step.title}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[99999] bg-popover border border-border shadow-2xl" sideOffset={10}>
                      <p>Próximamente</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25' 
                      : isCompleted
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-muted border-border text-muted-foreground'
                    }
                    ${!step.disabled && 'group-hover:scale-105'}
                  `}>
                    {isCompleted ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium mt-1 transition-colors duration-300
                    ${isActive 
                      ? 'text-primary' 
                      : isCompleted 
                        ? 'text-primary/80'
                        : 'text-muted-foreground'
                    }
                  `}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}