import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface TrendyWordsProps {
  onWordClick: (word: string) => void;
}

// Fallback words if webhook fails
const FALLBACK_WORDS = [
  "Inteligencia Artificial", "Metaverso", "NFTs", "Criptomonedas", "Realidad Virtual",
  "Streaming", "TikTok", "Gaming", "Esports", "Influencers", "Podcast", "Mindfulness"
];

const WEBHOOK_URL = "https://matiasalbaca.app.n8n.cloud/webhook/trendywords";

export const TrendyWords = ({ onWordClick }: TrendyWordsProps) => {
  const [currentWords, setCurrentWords] = useState<string[]>(FALLBACK_WORDS);
  const [loading, setLoading] = useState(false);

  const fetchTrendyWords = async (usePost = false) => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: usePost ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        ...(usePost && { body: JSON.stringify({}) })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Try different possible response formats
      let words: string[] = [];
      if (Array.isArray(data)) {
        words = data;
      } else if (data.words && Array.isArray(data.words)) {
        words = data.words;
      } else if (data.data && Array.isArray(data.data)) {
        words = data.data;
      } else {
        throw new Error('Invalid response format');
      }

      if (words.length > 0) {
        setCurrentWords(words);
        return true;
      } else {
        throw new Error('No words received');
      }
    } catch (error) {
      console.error('Error fetching trendy words:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadInitialWords = async () => {
      setLoading(true);
      
      // Try GET first
      const getSuccess = await fetchTrendyWords(false);
      
      if (!getSuccess) {
        // If GET fails, try POST
        const postSuccess = await fetchTrendyWords(true);
        
        if (!postSuccess) {
          // If both fail, use fallback
          setCurrentWords(FALLBACK_WORDS);
          toast.error("No se pudieron cargar palabras del servidor, usando palabras por defecto");
        }
      }
      
      setLoading(false);
    };

    loadInitialWords();
  }, []);

  const handleUpdateWords = async () => {
    setLoading(true);
    
    try {
      // Try GET first
      const getSuccess = await fetchTrendyWords(false);
      
      if (!getSuccess) {
        // If GET fails, try POST
        const postSuccess = await fetchTrendyWords(true);
        
        if (postSuccess) {
          toast.success("Palabras trendy actualizadas (POST)");
        } else {
          // If both fail, use fallback
          setCurrentWords(FALLBACK_WORDS);
          toast.error("Error al actualizar palabras trendy, usando palabras por defecto");
        }
      } else {
        toast.success("Palabras trendy actualizadas");
      }
    } catch (error) {
      toast.error("Error al actualizar palabras trendy");
      setCurrentWords(FALLBACK_WORDS);
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word: string) => {
    onWordClick(word);
    toast.success(`"${word}" agregado al tema principal`);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Palabras Trendy
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdateWords}
            disabled={loading}
            className="h-8"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {currentWords.map((word, index) => (
            <Badge
              key={`${word}-${index}`}
              variant="outline"
              className="cursor-pointer hover:scale-105 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 text-xs px-3 py-1"
              onClick={() => handleWordClick(word)}
            >
              {word}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          💡 Haz click en cualquier palabra para agregarla a tu tema principal
        </p>
      </CardContent>
    </Card>
  );
};