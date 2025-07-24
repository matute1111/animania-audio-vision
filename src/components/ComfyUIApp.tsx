
import { AudioSection } from "@/components/AudioSection";
import { VideoSection } from "@/components/VideoSection";
import { Header } from "@/components/Header";
import spaceBanner from "@/assets/space-banner.jpg";
import { useAudioGeneration } from "@/hooks/useAudioGeneration";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useStoryCreation } from "@/hooks/useStoryCreation";
import { useMetadataGeneration } from "@/hooks/useMetadataGeneration";
import { createVideoRecord, updateVideoRecord } from "@/utils/airtable";
import { toast } from "sonner";
import { useState } from "react";

export const ComfyUIApp = () => {
  const { voiceId, setVoiceId, script, setScript, imageFile, setImageFile } = useStoryCreation();
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  
  const { 
    audioSrc, 
    audioLoading, 
    audioError, 
    audioBlob, 
    generateAudio 
  } = useAudioGeneration();
  
  const { 
    videoSrc, 
    videoLoading, 
    videoError, 
    generateVideo 
  } = useVideoGeneration();

  const { generateMetadata } = useMetadataGeneration();

  const handleGenerateAudio = () => generateAudio(voiceId, script);
  
  const handleAnimateImage = async () => {
    try {
      // Generate video
      await generateVideo(imageFile!, audioBlob!, script);
      
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

  return (
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

        {/* Sections */}
        <div className="space-y-8">
          <AudioSection
            voiceId={voiceId}
            setVoiceId={setVoiceId}
            script={script}
            setScript={setScript}
            audioSrc={audioSrc}
            loading={audioLoading}
            error={audioError}
            onGenerateAudio={handleGenerateAudio}
            isBlocked={videoLoading}
          />

          <VideoSection
            imageFile={imageFile}
            setImageFile={setImageFile}
            videoSrc={videoSrc}
            loading={videoLoading}
            error={videoError}
            onAnimateImage={handleAnimateImage}
            audioSrc={audioSrc}
          />
        </div>

        {/* Success Message */}
        {currentRecordId && videoSrc && (
          <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <p className="text-green-600 font-medium">
              ¡Video agregado exitosamente a la lista de pendientes!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Puedes verlo en la página General → Videos Pendientes
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Donde cada historia cobra vida ✨
          </p>
        </div>
      </div>
    </div>
  );
};
