import { useState } from "react";
import { toast } from "sonner";
import { 
  createAudioWorkflow, 
  pollHistory, 
  extractMediaFromHistory, 
  buildMediaUrl, 
  fetchMediaAsBlob 
} from "@/utils/comfyui";

export const useAudioGeneration = () => {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const generateAudio = async (voiceId: string, script: string) => {
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

      toast.info("Creando la voz del personaje...", {
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
      
      toast.success("¡Voz del personaje creada correctamente!");
      
    } catch (error) {
      console.error('Error generando audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido generando audio';
      setAudioError(errorMessage);
      toast.error("Error creando la voz", {
        description: errorMessage
      });
    } finally {
      setAudioLoading(false);
    }
  };

  return {
    audioSrc,
    audioLoading,
    audioError,
    audioBlob,
    generateAudio
  };
};