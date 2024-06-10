// useMediaRecorder.ts
import { useRef, useState } from 'react';

type MediaRecorderHook = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

export function useMediaRecorder(
  startRecordingCallback: () => Promise<MediaStream>,
  stopRecordingCallback: () => void
): MediaRecorderHook {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Starts the media recording
  const startRecording = async () => {
    const stream = await startRecordingCallback();
    const mediaRecorder = new MediaRecorder(stream);
    // Setup event handlers for MediaRecorder here...
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stops the media recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingCallback();
    }
  };

  return { isRecording, startRecording, stopRecording };
}
