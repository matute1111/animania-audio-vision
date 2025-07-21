
import { useState } from "react";
import { toast } from "sonner";

export const useMetadataGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMetadata = async (script: string) => {
    if (!script.trim()) {
      throw new Error("Script is required for metadata generation");
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate AI metadata generation - In production, you'd use OpenAI or similar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate metadata based on script analysis
      const words = script.split(' ');
      const isStory = script.toLowerCase().includes('historia') || script.toLowerCase().includes('cuento');
      const isEducational = script.toLowerCase().includes('aprende') || script.toLowerCase().includes('educativo');
      
      let category = "General";
      if (isStory) category = "Historias";
      else if (isEducational) category = "Educativo";
      
      const title = `${words.slice(0, 5).join(' ')}...`.replace(/[.!?]+$/, '');
      const description = `Un fascinante contenido sobre ${words.slice(0, 3).join(' ').toLowerCase()}. ${script.slice(0, 100)}...`;
      
      return {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description,
        category_id: category
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error generating metadata";
      setError(errorMessage);
      toast.error("Error generando metadatos", {
        description: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateMetadata,
    loading,
    error
  };
};
