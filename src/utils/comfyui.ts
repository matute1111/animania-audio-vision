// Utility functions for ComfyUI API interactions

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const createAudioWorkflow = (text: string, voiceId: string) => ({
  "1": {
    "class_type": "ElevenLabsTTS",
    "inputs": {
      "text": text,
      "voice_id": voiceId,
      "api_key": "sk_c76505c1790b1d647e7131b431888c1a736f006dac3993be",
      "model_id": "eleven_multilingual_v2",
      "output_format": "mp3_44100_128"
    }
  },
  "2": {
    "class_type": "SaveAudio",
    "inputs": {
      "audio": ["1", 0],
      "filename_prefix": "audio/elevenlabs/"
    }
  }
});

export const createVideoWorkflow = (imageBase64: string, audioBase64: string, prompt: string) => ({
  "1": {
    "class_type": "HedraImageToVideoFile",
    "inputs": {
      "image": imageBase64,
      "audio": audioBase64,
      "prompt": prompt,
      "aspect_ratio": "9:16",
      "resolution": "540p"
    }
  }
});

export const pollHistory = async (promptId: string): Promise<any> => {
  const maxAttempts = 300; // 5 minutes at 1 second intervals
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await fetch(`http://0.0.0.0:8188/history/${promptId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const historyItem = data[promptId];
        
        if (!historyItem) {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Timeout: No se pudo obtener el estado de la tarea'));
            return;
          }
          setTimeout(poll, 1000);
          return;
        }
        
        const status = historyItem.status;
        
        if (status.status_str === 'running' || status.status_str === 'pending') {
          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Timeout: La tarea está tomando demasiado tiempo'));
            return;
          }
          setTimeout(poll, 1000);
        } else {
          // Task completed
          resolve(historyItem);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
};

export const extractMediaFromHistory = (historyItem: any, mediaType: 'audio' | 'video') => {
  const outputs = historyItem.outputs;
  if (!outputs) {
    throw new Error('No se encontraron archivos de salida');
  }
  
  for (const nodeId in outputs) {
    const nodeOutputs = outputs[nodeId];
    
    if (mediaType === 'audio' && nodeOutputs.audio) {
      const audioFiles = nodeOutputs.audio;
      if (audioFiles.length > 0) {
        const audio = audioFiles[0];
        return {
          filename: audio.filename,
          subfolder: audio.subfolder,
          type: audio.type
        };
      }
    } else if (mediaType === 'video' && nodeOutputs.videos) {
      const videoFiles = nodeOutputs.videos;
      if (videoFiles.length > 0) {
        const video = videoFiles[0];
        return {
          filename: video.filename,
          subfolder: video.subfolder,
          type: video.type
        };
      }
    }
  }
  
  throw new Error(`No se encontró archivo de ${mediaType} en los resultados`);
};

export const buildMediaUrl = (filename: string, subfolder: string, type: string) => {
  const params = new URLSearchParams({
    filename,
    subfolder,
    type
  });
  
  return `http://0.0.0.0:8188/view?${params.toString()}`;
};

export const fetchMediaAsBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al descargar el archivo: ${response.status}`);
  }
  return response.blob();
};