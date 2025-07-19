import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Voice {
  voice_id: string;
  name: string;
  category: string;
}

export const useVoices = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesLoading, setVoicesLoading] = useState(false);
  const [voicesError, setVoicesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      setVoicesLoading(true);
      setVoicesError(null);
      
      try {
        const ELEVENLABS_API_KEY = "sk_c76505c1790b1d647e7131b431888c1a736f006dac3993be";
        const response = await fetch("https://api.elevenlabs.io/v1/voices", {
          headers: {
            "xi-api-key": ELEVENLABS_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching voices: ${response.status}`);
        }

        const data = await response.json();

        // Filter only voices with category === 'generated'
        const generatedVoices = (data.voices || []).filter(
          (voice: Voice) => voice.category === "generated"
        );

        setVoices(generatedVoices);
        console.log("Generated voices:", generatedVoices);
      } catch (error) {
        console.error("Error fetching voices:", error);
        const errorMessage = error instanceof Error ? error.message : 'Error fetching voices';
        setVoicesError(errorMessage);
        toast.error("Error cargando voces", {
          description: errorMessage
        });
      } finally {
        setVoicesLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return {
    voices,
    voicesLoading,
    voicesError
  };
};