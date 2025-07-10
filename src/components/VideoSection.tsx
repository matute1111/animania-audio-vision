import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Video, Upload, FileImage } from "lucide-react";

interface VideoSectionProps {
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  videoSrc: string | null;
  loading: boolean;
  error: string | null;
  onAnimateImage: () => void;
  audioSrc: string | null;
}

export const VideoSection = ({
  imageFile,
  setImageFile,
  videoSrc,
  loading,
  error,
  onAnimateImage,
  audioSrc
}: VideoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (!audioSrc) {
    return (
      <div className="bg-muted/30 border border-border rounded-xl p-8 opacity-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-muted rounded-lg">
            <Video className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-muted-foreground">2. Dar Vida a la Historia 🎬</h2>
        </div>
        <p className="text-muted-foreground">
          Primero crea la voz del personaje para poder dar vida a tu historia
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-8 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-story rounded-lg">
          <Video className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">2. Dar Vida a la Historia 🎬</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagen del Personaje
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={loading}
          />
          
          <div
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group"
          >
            {imageFile ? (
              <div className="space-y-3">
                <FileImage className="w-12 h-12 text-success mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{imageFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Haz clic para cambiar la imagen
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                <div>
                  <p className="font-medium text-foreground">Subir Imagen del Personaje</p>
                  <p className="text-sm text-muted-foreground">
                    Sube la imagen que cobrará vida
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Formatos: JPG, PNG, WEBP (máx. 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Button
          onClick={onAnimateImage}
          disabled={!imageFile || loading}
          variant="story"
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              Dando Vida a la Historia...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Dar Vida a la Historia
            </>
          )}
        </Button>

        {videoSrc && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-3">Tu Historia Ha Cobrado Vida</h3>
            <video
              src={videoSrc}
              controls
              autoPlay
              muted
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: '400px' }}
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};