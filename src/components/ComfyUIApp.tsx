import { AudioSection } from "@/components/AudioSection";
import { VideoSection } from "@/components/VideoSection";
import { Header } from "@/components/Header";
import spaceBanner from "@/assets/space-banner.jpg";
import { useAudioGeneration } from "@/hooks/useAudioGeneration";
import { useVideoGeneration } from "@/hooks/useVideoGeneration";
import { useStoryCreation } from "@/hooks/useStoryCreation";

export const ComfyUIApp = () => {
  const { voiceId, setVoiceId, script, setScript, imageFile, setImageFile } = useStoryCreation();
  
  const { 
    audioSrc, 
    audioLoading, 
    audioError, 
    audioBlob, 
    generateAudio 
  } = useAudioGeneration();
  
  const { 
    videoSrc, 
    videoLoading, 
    videoError, 
    generateVideo 
  } = useVideoGeneration();

  const handleGenerateAudio = () => generateAudio(voiceId, script);
  const handleAnimateImage = () => generateVideo(imageFile!, audioBlob!, script);

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: `url(${spaceBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <Header />

        {/* Sections */}
        <div className="space-y-8">
          <AudioSection
            voiceId={voiceId}
            setVoiceId={setVoiceId}
            script={script}
            setScript={setScript}
            audioSrc={audioSrc}
            loading={audioLoading}
            error={audioError}
            onGenerateAudio={handleGenerateAudio}
            isBlocked={videoLoading}
          />

          <VideoSection
            imageFile={imageFile}
            setImageFile={setImageFile}
            videoSrc={videoSrc}
            loading={videoLoading}
            error={videoError}
            onAnimateImage={handleAnimateImage}
            audioSrc={audioSrc}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Donde cada historia cobra vida ✨
          </p>
        </div>
      </div>
    </div>
  );
};