import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useVoices } from "@/hooks/useVoices";
import { Mic, Play, Pause } from "lucide-react";

interface AudioSectionProps {
  voiceId: string;
  setVoiceId: (value: string) => void;
  script: string;
  setScript: (value: string) => void;
  audioSrc: string | null;
  loading: boolean;
  error: string | null;
  onGenerateAudio: () => void;
  isBlocked?: boolean;
}

export const AudioSection = ({
  voiceId,
  setVoiceId,
  script,
  setScript,
  audioSrc,
  loading,
  error,
  onGenerateAudio,
  isBlocked = false
}: AudioSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { voices, voicesLoading, voicesError } = useVoices();

  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);

  const isFormValid = voiceId.trim() && script.trim();
  const isDisabled = !isFormValid || loading || isBlocked;

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-voice rounded-lg">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">1. Crear Voz del Personaje 🎤</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="voiceId" className="block text-sm font-medium text-foreground mb-2">
            Voz del Personaje
          </label>
          <Select
            value={voiceId}
            onValueChange={setVoiceId}
            disabled={loading || isBlocked || voicesLoading}
          >
            <SelectTrigger className="bg-muted border-border">
              <SelectValue placeholder={voicesLoading ? "Cargando voces..." : "Selecciona una voz"} />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="script" className="block text-sm font-medium text-foreground mb-2">
            Historia del Personaje
          </label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Escribe aquí la historia que tu personaje contará..."
            className="bg-muted border-border min-h-32"
            disabled={loading || isBlocked}
          />
        </div>

        {error && <ErrorMessage message={error} />}
        {voicesError && <ErrorMessage message={`Error cargando voces: ${voicesError}`} />}

        <Button
          onClick={onGenerateAudio}
          disabled={isDisabled}
          variant="voice"
          size="lg"
          className="w-full"
        >
          {isBlocked ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              Generando Video...
            </>
          ) : loading ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              Creando la Voz...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Crear Voz del Personaje
            </>
          )}
        </Button>

        {audioSrc && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Voz del Personaje Lista</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const audio = document.getElementById('generated-audio') as HTMLAudioElement;
                    if (audio) {
                      if (isPlaying) {
                        audio.pause();
                      } else {
                        audio.play();
                      }
                    }
                  }}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <audio
              id="generated-audio"
              src={audioSrc}
              controls
              className="w-full"
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
              onEnded={handleAudioPause}
            />
          </div>
        )}
      </div>
    </div>
  );
};