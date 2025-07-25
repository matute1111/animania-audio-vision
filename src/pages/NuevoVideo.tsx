import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { VideoSection } from "@/components/VideoSection";
import { useVideoCreationFlow } from "@/hooks/useVideoCreationFlow";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useMetadataGeneration } from "@/hooks/useMetadataGeneration";
import { createVideoRecord, updateVideoRecord } from "@/utils/airtable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import spaceBanner from "@/assets/space-banner.jpg";

const NuevoVideo = () => {
  const navigate = useNavigate();
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
  const {
    script,
    audioSrc,
    audioBlob,
    imageFile,
    setImageFile,
    clearState,
  } = useVideoCreationFlow();

  const { 
    videoSrc, 
    videoLoading, 
    videoError, 
    generateVideo 
  } = useVideoGeneration();

  const { generateMetadata } = useMetadataGeneration();

  const handleAnimateImage = async () => {
    if (!audioBlob || !imageFile) {
      toast.error("Se requiere audio e imagen para generar el video");
      return;
    }

    try {
      // Generate video
      await generateVideo(imageFile, audioBlob, script);
      
      // Create initial record in Airtable
      const recordId = await createVideoRecord({
        raw: true,
        audio: true,
        script: script,
        status: "PENDING"
      });
      
      setCurrentRecordId(recordId);
      toast.success("¡Video creado y agregado a pendientes!");
      
      // Generate metadata automatically
      try {
        const metadata = await generateMetadata(script);
        await updateVideoRecord(recordId, metadata);
        toast.success("Metadatos generados automáticamente");
      } catch (error) {
        console.error("Error generating metadata:", error);
        toast.warning("Video creado, pero no se pudieron generar los metadatos automáticamente");
      }
      
    } catch (error) {
      console.error("Error in video process:", error);
      toast.error("Error en el proceso de video");
    }
  };

  const handleFinish = () => {
    clearState();
    navigate("/general");
    toast.success("Proceso completado. Puedes ver tu video en Videos Pendientes");
  };

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
                  Imagen y Video
                </h1>
                <p className="text-muted-foreground">
                  Sube una imagen y anima el personaje con el audio generado
                </p>
              </div>

              {(!script || !audioSrc) && (
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-600 font-medium">
                    Faltan elementos previos del proceso.
                    <Button 
                      variant="link" 
                      className="p-0 ml-1 text-yellow-600 underline"
                      onClick={() => navigate("/nuevo-guion")}
                    >
                      Comenzar desde el guión
                    </Button>
                    {" o "}
                    <Button 
                      variant="link" 
                      className="p-0 text-yellow-600 underline"
                      onClick={() => navigate("/nuevo-audio")}
                    >
                      ir al audio
                    </Button>
                  </p>
                </div>
              )}

              <VideoSection
                imageFile={imageFile}
                setImageFile={setImageFile}
                videoSrc={videoSrc}
                loading={videoLoading}
                error={videoError}
                onAnimateImage={handleAnimateImage}
                audioSrc={audioSrc}
              />

              {/* Success Message */}
              {currentRecordId && videoSrc && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                    <p className="text-green-600 font-medium">
                      ¡Video agregado exitosamente a la lista de pendientes!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Puedes verlo en la página General → Videos Pendientes
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={handleFinish}
                      className="bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Finalizar y Volver a General
                    </Button>
                  </div>
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

export default NuevoVideo;