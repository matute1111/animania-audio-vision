import { useState, useEffect } from "react";

interface VideoCreationState {
  script: string;
  voiceId: string;
  audioSrc: string | null;
  audioBlob: Blob | null;
  imageFile: File | null;
}

const STORAGE_KEY = "videoCreationFlow";

export const useVideoCreationFlow = () => {
  const [state, setState] = useState<VideoCreationState>({
    script: "",
    voiceId: "",
    audioSrc: null,
    audioBlob: null,
    imageFile: null,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prevState => ({
          ...prevState,
          script: parsed.script || "",
          voiceId: parsed.voiceId || "",
          // Note: audioSrc and audioBlob will be regenerated if needed
          // imageFile cannot be persisted, user will need to re-upload
        }));
      } catch (error) {
        console.error("Error loading video creation state:", error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  const updateState = (updates: Partial<VideoCreationState>) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Save to localStorage (excluding non-serializable data)
      const toSave = {
        script: newState.script,
        voiceId: newState.voiceId,
        // audioSrc and audioBlob are not saved - they'll be regenerated
        // imageFile is not saved - user will need to re-upload
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      
      return newState;
    });
  };

  const clearState = () => {
    setState({
      script: "",
      voiceId: "",
      audioSrc: null,
      audioBlob: null,
      imageFile: null,
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    ...state,
    updateState,
    clearState,
    setScript: (script: string) => updateState({ script }),
    setVoiceId: (voiceId: string) => updateState({ voiceId }),
    setAudioSrc: (audioSrc: string | null) => updateState({ audioSrc }),
    setAudioBlob: (audioBlob: Blob | null) => updateState({ audioBlob }),
    setImageFile: (imageFile: File | null) => updateState({ imageFile }),
  };
};