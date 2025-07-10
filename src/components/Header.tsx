import logoHistoriasInfinitas from "@/assets/logo-historias-infinitas.png";

export const Header = () => {
  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <img 
          src={logoHistoriasInfinitas} 
          alt="Historias Infinitas Logo" 
          className="mx-auto h-32 w-auto drop-shadow-2xl"
        />
      </div>
      <h1 className="text-6xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-6">
        HUB de HISTORIAS INFINITAS
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Crea <span className="text-voice-primary font-semibold">voces mágicas</span> para tus personajes y 
        da <span className="text-story-primary font-semibold">vida a tus historias</span> con videos animados únicos. 
        Un mundo de aventuras infinitas te espera.
      </p>
    </div>
  );
};