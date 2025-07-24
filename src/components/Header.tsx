
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="text-center mb-12">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/general")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex-1">
          <Navigation />
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mb-8">
        <img 
          src="/lovable-uploads/496298ba-545a-4aea-9c8d-fb78f1a89456.png" 
          alt="Historias Infinitas Logo" 
          className="mx-auto h-32 w-auto drop-shadow-2xl" 
        />
      </div>
      <h1 className="text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
        Video nuevo
      </h1>
    </div>
  );
};