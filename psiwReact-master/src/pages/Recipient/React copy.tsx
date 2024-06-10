import { useRef, useEffect, useState } from "react"
import Webcam from "react-webcam"
import { sendReact } from "../../services/requests"
import { PsiwApp } from "../../components/svg/PsiwApp"
import { BirdColor } from "../../components/svg/BirdColor"
import { useLocation } from "react-router-dom"

export function React() {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [initialStream, setInitialStream] = useState<MediaStream | null>(null);
  const reactionVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const uploadButtonRef = useRef<HTMLButtonElement | null>(null);
  
  const location = useLocation()
  const mediaData = location.state.mediaData

  const [text, setText] = useState('Loading');

  useEffect(() => {
    const phrases = ['Gravando', 'Gravando .', 'Gravando . .', 'Gravando . . .'];
    const intervalId = setInterval(() => setText((prevText) => phrases[(phrases.indexOf(prevText) + 1) % phrases.length]), 500);
    return () => clearInterval(intervalId);
  }, [text]);

  useEffect(() => {
    if (reactionVideoRef.current && mediaData?.viewedFile) {
      reactionVideoRef.current.src = `${mediaData.viewedFile}#t=0.1`;
    }
  }, [mediaData]);

  const handleReactionVideoPlay = () => {
    console.log("Reaction video play event");
    startRecording();
  };

  const startRecording = () => {
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        console.log("Media stream acquired", stream);
        setInitialStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });

    if (!webcamRef.current || !initialStream) {
      console.error("Webcam is not ready or initial stream is not available");
      return;
    }
    console.log("Starting recording");
    setIsRecording(true);
  
    // Disable audio for the webcam
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  
    // Use the initial stream for recording
    const mediaRecorder = new MediaRecorder(initialStream);
    const chunks: Blob[] = [];
  
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
  
    mediaRecorder.onstop = () => {
      console.log("Recording stopped");
      
      const blob = new Blob(chunks, { type: "video/webm" });
      uploadVideo(blob);
    };

    mediaRecorder.onerror = (event) => {
      console.error("MediaRecorder error:", event); // Log any MediaRecorder errors
    };
  
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
  };

  const stopRecording = () => {
    console.log("Stopping recording");
  
    // Stop MediaRecorder if it's recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  
    // Stop the webcam stream
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(track => track.stop());
    }
  
    // Stop the audio stream tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
  
    // Stop the initial stream tracks
    if (initialStream) {
      initialStream.getTracks().forEach(track => track.stop());
    }
  
    // Resetting the refs
    webcamRef.current = null;
    mediaRecorderRef.current = null;
    audioStreamRef.current = null;
  };
  

  const uploadVideo = async (videoBlob: Blob) => {
    console.log("Uploading video, size:", videoBlob.size);
    stopRecording()
    const formData = new FormData();
    if (mediaData?.psiwId) {
      formData.append("psiwId", mediaData?.psiwId);
      formData.append("reactedFiles", videoBlob, "capturedVideo.webm");
    }
    try {
      setIsUploading(true)
      const id = await sendReact(formData);
      if (id.length > 0) {
        // handleShare(id as string)
        // handlePageChange(3)
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  useEffect(() => {
    if (reactionVideoRef.current) {
      reactionVideoRef.current.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (reactionVideoRef.current) {
        reactionVideoRef.current.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, []);

  useEffect(() => {
    if(isUploading && isRecording){
      stopRecording()
    }
  }, [isUploading, isRecording]);

  const handleVideoEnd = () => {
    console.log("Reaction video ended");
    setHasVideoEnded(true);

    if (reactionVideoRef.current) {
      reactionVideoRef.current.removeEventListener("ended", handleVideoEnd);
    }
  };

  const handleVideoClick = () => {
    if (reactionVideoRef.current && !hasVideoEnded) {
      if (reactionVideoRef.current.paused) {
        reactionVideoRef.current.play();
      } else {
        reactionVideoRef.current.pause();
      }
    }
  };

  return (
    <div
      className={`relative flex overflow-hidden bg-gray-100 w-screen h-screen`}
    >
        <div className="flex relative h-full">
          <div className="flex w-4/5 relative h-full flex-col items-start">
            {
              isRecording &&
              <div className="fixed top-2 left-2 flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <p className="leading-0 text-lg align-middle mt-1">{text}</p>
            </div>
            }
            
            <video
              ref={reactionVideoRef}
              style={{ width: '100%', height: '74%', objectFit: 'cover' }}
              onPlay={handleReactionVideoPlay}
              onClick={!hasVideoEnded ? handleVideoClick : undefined}
              controls={false}
              preload="metadata"
              playsInline
            />
              <button
                onClick={stopRecording}
                ref={uploadButtonRef}
                className="z-50 m-1 mt-4 flex flex-col items-center"
                disabled={!isRecording}
              >
              <div className={`w-10 h-10  rounded-full mb-2 border-black border ${isRecording ? 'bg-pink-500' : 'bg-green-500'}`}></div>
              { isRecording && <p className="text-2xl">Finalizar</p> }
              {isRecording ? <p>A gravação da sua reação</p> : <p>Clique na tela<br/>para iniciar a gravação</p>}
            </button>
          </div>

          <div className="flex w-1/5 gap-8 pt-8 items-center flex-col">
            <BirdColor color={'presente'} width={36} height={36} className={mediaData?.psiwType !== 'presente' ? 'opacity-20' : ''} />
            <BirdColor color={'sentimento'} width={36} height={36} className={mediaData?.psiwType !== 'sentimento' ? 'opacity-20' : ''} />
            <BirdColor color={'indagacao'} width={36} height={36} className={mediaData?.psiwType !== 'indagacao' ? 'opacity-20' : ''} />
            <BirdColor color={'wow'} width={36} height={36} className={mediaData?.psiwType !== 'wow' ? 'opacity-20' : ''} />
            <PsiwApp className="w-8" />
          </div>
          <Webcam
            ref={webcamRef}
            className="absolute bottom-0 right-0 z-10 w-3/5 h-80 object-cover"
            audio={false} // Keep audio enabled here
            mirrored
            videoConstraints={{ facingMode: "user" }}
          /> 
        </div>
      </div>
  );
}