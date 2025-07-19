import { useState } from "react";
import { toast } from "sonner";
import { 
  toBase64, 
  createVideoWorkflow, 
  pollHistory, 
  extractMediaFromHistory, 
  buildMediaUrl, 
  fetchMediaAsBlob 
} from "@/utils/comfyui";

export const useVideoGeneration = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const generateVideo = async (imageFile: File, audioBlob: Blob, script: string) => {
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
      const response = await fetch('http://localhost:8188/prompt', {
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

      toast.info("Dando vida a la historia...", {
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
      
      toast.success("¡Tu historia ha cobrado vida!");
      
    } catch (error) {
      console.error('Error animando imagen:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido animando imagen';
      setVideoError(errorMessage);
      toast.error("Error dando vida a la historia", {
        description: errorMessage
      });
    } finally {
      setVideoLoading(false);
    }
  };

  return {
    videoSrc,
    videoLoading,
    videoError,
    generateVideo
  };
};