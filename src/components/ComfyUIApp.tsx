import { useState } from "react";
import { toast } from "sonner";
import { AudioSection } from "@/components/AudioSection";
import { VideoSection } from "@/components/VideoSection";
import backgroundPattern from "@/assets/background-pattern.jpg";
import { 
  toBase64, 
  createAudioWorkflow, 
  createVideoWorkflow, 
  pollHistory, 
  extractMediaFromHistory, 
  buildMediaUrl, 
  fetchMediaAsBlob 
} from "@/utils/comfyui";

export const ComfyUIApp = () => {
  // Estados principales
  const [voiceId, setVoiceId] = useState("");
  const [script, setScript] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  // Estados de carga y errores
  const [audioLoading, setAudioLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Variables para el proceso de video
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleGenerateAudio = async () => {
    if (!voiceId.trim() || !script.trim()) {
      setAudioError("Por favor, completa todos los campos requeridos");
      return;
    }

    setAudioLoading(true);
    setAudioError(null);
    
    try {
      // Crear el workflow para audio
      const workflow = createAudioWorkflow(script, voiceId);
      
      // Enviar la petición a ComfyUI
      const response = await fetch('/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: workflow }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      const promptId = result.prompt_id;
      
      if (!promptId) {
        throw new Error('No se recibió un ID de tarea válido');
      }

      toast.info("Generando audio...", {
        description: "Este proceso puede tomar algunos minutos"
      });

      // Hacer polling hasta que termine
      const historyItem = await pollHistory(promptId);
      
      // Extraer el archivo de audio
      const audioInfo = extractMediaFromHistory(historyItem, 'audio');
      const audioUrl = buildMediaUrl(audioInfo.filename, audioInfo.subfolder, audioInfo.type);
      
      // Obtener el audio como blob
      const blob = await fetchMediaAsBlob(audioUrl);
      setAudioBlob(blob);
      
      // Crear URL para reproducción
      const objectUrl = URL.createObjectURL(blob);
      setAudioSrc(objectUrl);
      
      toast.success("¡Audio generado correctamente!");
      
    } catch (error) {
      console.error('Error generando audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido generando audio';
      setAudioError(errorMessage);
      toast.error("Error generando audio", {
        description: errorMessage
      });
    } finally {
      setAudioLoading(false);
    }
  };

  const handleAnimateImage = async () => {
    if (!imageFile || !audioBlob) {
      setVideoError("Se requiere una imagen y audio generado");
      return;
    }

    setVideoLoading(true);
    setVideoError(null);
    
    try {
      // Convertir archivos a base64
      const imageBase64 = await toBase64(imageFile);
      const audioBase64 = await toBase64(new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' }));
      
      // Crear el workflow para video
      const workflow = createVideoWorkflow(imageBase64, audioBase64, script);
      
      // Enviar la petición a ComfyUI
      const response = await fetch('/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: workflow }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const result = await response.json();
      const promptId = result.prompt_id;
      
      if (!promptId) {
        throw new Error('No se recibió un ID de tarea válido');
      }

      toast.info("Animando imagen...", {
        description: "Este proceso puede tomar varios minutos"
      });

      // Hacer polling hasta que termine
      const historyItem = await pollHistory(promptId);
      
      // Extraer el archivo de video
      const videoInfo = extractMediaFromHistory(historyItem, 'video');
      const videoUrl = buildMediaUrl(videoInfo.filename, videoInfo.subfolder, videoInfo.type);
      
      // Obtener el video como blob
      const blob = await fetchMediaAsBlob(videoUrl);
      
      // Crear URL para reproducción
      const objectUrl = URL.createObjectURL(blob);
      setVideoSrc(objectUrl);
      
      toast.success("¡Video animado generado correctamente!");
      
    } catch (error) {
      console.error('Error animando imagen:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido animando imagen';
      setVideoError(errorMessage);
      toast.error("Error animando imagen", {
        description: errorMessage
      });
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-lg animate-glow-pulse">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 10s9-4.45 9-10V7L12 2z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            ComfyUI Audio & Video Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Genera audio profesional con <span className="text-audio-primary font-semibold">ElevenLabs</span> y 
            crea videos animados impresionantes usando <span className="text-video-primary font-semibold">ComfyUI</span>. 
            Un flujo completo de dos pasos para contenido multimedia de alta calidad.
          </p>
        </div>

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

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by ElevenLabs TTS + ComfyUI
          </p>
        </div>
      </div>
    </div>
  );
};