import logoHistoriasInfinitas from "@/assets/logo-historias-infinitas.png";
import { Navigation } from "@/components/Navigation";

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <Navigation />
      <div className="mb-8">
        <img 
          src={logoHistoriasInfinitas} 
          alt="Historias Infinitas Logo" 
          className="mx-auto h-32 w-auto drop-shadow-2xl" 
        />
      </div>
      <h1 className="text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
        Hub de Historias Infinitas
      </h1>
    </div>
  );
};