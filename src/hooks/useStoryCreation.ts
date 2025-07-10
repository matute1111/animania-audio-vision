import { useState } from "react";

export const useStoryCreation = () => {
  const [voiceId, setVoiceId] = useState("");
  const [script, setScript] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  return {
    voiceId,
    setVoiceId,
    script,
    setScript,
    imageFile,
    setImageFile
  };
};