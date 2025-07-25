import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AudioSection } from "@/components/AudioSection";
import { useVideoCreationFlow } from "@/hooks/useVideoCreationFlow";
import { useAudioGeneration } from "@/hooks/useAudioGeneration";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import spaceBanner from "@/assets/space-banner.jpg";

const NuevoAudio = () => {
  const navigate = useNavigate();
  const {
    script,
    voiceId,
    audioSrc,
    audioBlob,
    setVoiceId,
    setAudioSrc,
    setAudioBlob,
  } = useVideoCreationFlow();

  const { 
    audioLoading, 
    audioError, 
    generateAudio 
  } = useAudioGeneration();

  const handleGenerateAudio = async () => {
    if (!script.trim()) {
      toast.error("Primero debes crear un guión en la página anterior");
      navigate("/nuevo-guion");
      return;
    }
    
    try {
      await generateAudio(voiceId, script);
      // The hook will update its internal state, we need to sync it
      // Note: This is handled by the audio generation hook's internal state
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const handleContinueToVideo = () => {
    if (!audioSrc) {
      toast.error("Primero debes generar el audio");
      return;
    }
    navigate("/nuevo-video");
  };

  // Sync audio generation hook state with flow state
  if (audioSrc !== null && audioBlob !== null) {
    // This will be handled by the AudioSection component
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <div 
            className="min-h-screen bg-background relative"
            style={{
              backgroundImage: `url(${spaceBanner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
              
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-magic bg-clip-text text-transparent mb-2">
                  Crear Audio del Personaje
                </h1>
                <p className="text-muted-foreground">
                  Genera la voz del personaje usando el guión creado
                </p>
              </div>

              {!script && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-600 font-medium">
                    No hay guión disponible. 
                    <Button 
                      variant="link" 
                      className="p-0 ml-1 text-yellow-600 underline"
                      onClick={() => navigate("/nuevo-guion")}
                    >
                      Ir a crear guión
                    </Button>
                  </p>
                </div>
              )}

              <AudioSection
                voiceId={voiceId}
                setVoiceId={setVoiceId}
                script={script}
                setScript={() => {}} // Script is read-only here
                audioSrc={audioSrc}
                loading={audioLoading}
                error={audioError}
                onGenerateAudio={handleGenerateAudio}
                isBlocked={false}
              />

              {audioSrc && (
                <div className="mt-8 text-center">
                  <Button 
                    onClick={handleContinueToVideo}
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    Continuar a Imagen y Video →
                  </Button>
                </div>
              )}

              <div className="mt-16 text-center">
                <p className="text-sm text-muted-foreground">
                  ✨ Donde cada historia cobra vida ✨
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default NuevoAudio;