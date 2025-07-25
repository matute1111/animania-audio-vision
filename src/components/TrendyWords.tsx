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
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrendyWords = async () => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse the actual format from n8n webhook
      // Response format: {"keywords_string": [{"keywords": "keywords_string"}]}
      let keywordsString = '';
      
      if (Array.isArray(data) && data.length > 0 && data[0].keywords) {
        // Format: [{"keywords": "word1 (2x), word2 (3x), ..."}]
        keywordsString = data[0].keywords;
      } else if (typeof data === 'object' && data !== null) {
        // Format: {"keywords_string": [{"keywords": "keywords_string"}]}
        const keys = Object.keys(data);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const value = data[firstKey];
          if (Array.isArray(value) && value.length > 0 && value[0].keywords) {
            keywordsString = value[0].keywords;
          }
        }
      }
      
      if (keywordsString) {
        // Split by comma and clean each word
        const words = keywordsString
          .split(',')
          .map((word: string) => word.trim().replace(/\s*\(\d+x\)$/, '').trim())
          .filter((word: string) => word.length > 0);
        
        if (words.length > 0) {
          setCurrentWords(words);
          return true;
        }
      }
      
      throw new Error('Invalid response format or no keywords found');
    } catch (error) {
      console.error('Error fetching trendy words:', error);
      return false;
    }
  };

  useEffect(() => {
    const loadInitialWords = async () => {
      setLoading(true);
      
      const success = await fetchTrendyWords();
      
      if (!success) {
        setCurrentWords(FALLBACK_WORDS);
        toast.error("No se pudieron cargar palabras trendy desde el servidor, usando palabras de ejemplo");
      }
      
      setLoading(false);
    };

    loadInitialWords();
  }, []);

  const handleUpdateWords = async () => {
    setLoading(true);
    
    try {
      const success = await fetchTrendyWords();
      
      if (success) {
        toast.success("Palabras trendy actualizadas");
      } else {
        setCurrentWords(FALLBACK_WORDS);
        toast.error("Error al actualizar palabras trendy, usando palabras de ejemplo");
      }
    } catch (error) {
      toast.error("Error al actualizar palabras trendy");
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