import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface TrendyWordsProps {
  onWordClick: (word: string) => void;
}

const TRENDY_WORDS_SETS = [
  [
    "Inteligencia Artificial", "Metaverso", "NFTs", "Criptomonedas", "Realidad Virtual",
    "Streaming", "TikTok", "Gaming", "Esports", "Influencers", "Podcast", "Mindfulness"
  ],
  [
    "Sostenibilidad", "Energía Solar", "Vehículos Eléctricos", "Comida Plant-Based",
    "Trabajo Remoto", "Wellness", "Meditación", "Yoga", "Fitness", "Lifestyle", "Bienestar"
  ],
  [
    "Space X", "Viajes Espaciales", "Tecnología 5G", "Smart Cities", "IoT",
    "Robótica", "Automation", "Machine Learning", "Blockchain", "Cybersecurity", "Drones"
  ],
  [
    "K-Pop", "Anime", "Netflix", "Marvel", "DC Comics", "Star Wars",
    "Harry Potter", "Disney", "Pixar", "Gaming", "Fortnite", "Minecraft"
  ],
  [
    "Cambio Climático", "Reciclaje", "Zero Waste", "Economía Circular",
    "Startups", "Emprendimiento", "Innovación", "Disrupción", "Unicornios", "FinTech"
  ]
];

export const TrendyWords = ({ onWordClick }: TrendyWordsProps) => {
  const [currentWords, setCurrentWords] = useState(TRENDY_WORDS_SETS[0]);
  const [loading, setLoading] = useState(false);

  const handleUpdateWords = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get random word set
      const randomIndex = Math.floor(Math.random() * TRENDY_WORDS_SETS.length);
      setCurrentWords(TRENDY_WORDS_SETS[randomIndex]);
      
      toast.success("Palabras trendy actualizadas");
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
              className="cursor-pointer hover:scale-105 transition-transform duration-200 text-xs px-3 py-1"
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