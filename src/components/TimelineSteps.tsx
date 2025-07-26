import { useLocation } from "react-router-dom";
import { FileText, Volume2, Image, Sliders, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  path: string;
  disabled?: boolean;
}
const steps: Step[] = [{
  id: "guion",
  title: "Guión",
  icon: FileText,
  path: "/nuevo-guion"
}, {
  id: "audio",
  title: "Audio",
  icon: Volume2,
  path: "/nuevo-audio"
}, {
  id: "imagen",
  title: "Imagen",
  icon: Image,
  path: "/nuevo-video"
}, {
  id: "post-produccion",
  title: "Post Producción",
  icon: Sliders,
  path: "/post-produccion",
  disabled: true
}];
export function TimelineSteps() {
  const location = useLocation();
  const currentPath = location.pathname;
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.path === currentPath);
  };
  const currentStepIndex = getCurrentStepIndex();
  return <TooltipProvider>
      <div className="mb-6">
        
      </div>
    </TooltipProvider>;
}