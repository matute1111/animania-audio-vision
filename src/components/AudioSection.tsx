import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
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
}

export const AudioSection = ({
  voiceId,
  setVoiceId,
  script,
  setScript,
  audioSrc,
  loading,
  error,
  onGenerateAudio
}: AudioSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioPause = () => setIsPlaying(false);

  const isFormValid = voiceId.trim() && script.trim();

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-audio rounded-lg">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">1. Generar Audio 🎤</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="voiceId" className="block text-sm font-medium text-foreground mb-2">
            Voice ID de ElevenLabs
          </label>
          <Input
            id="voiceId"
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            placeholder="Ej: EXAVITQu4vr4xnSDxMaL"
            className="bg-muted border-border"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="script" className="block text-sm font-medium text-foreground mb-2">
            Guión / Script
          </label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Escribe aquí el texto que quieres convertir a audio..."
            className="bg-muted border-border min-h-32"
            disabled={loading}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <Button
          onClick={onGenerateAudio}
          disabled={!isFormValid || loading}
          variant="audio"
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              Generando Audio...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Generar Audio
            </>
          )}
        </Button>

        {audioSrc && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Audio Generado</h3>
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