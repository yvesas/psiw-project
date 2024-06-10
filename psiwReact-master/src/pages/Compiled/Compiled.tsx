import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMediaReact } from "../../services/requests";
import { Button } from "../../components/Button";

export function Compiled() {
  const [mediaData, setMediaData] = useState({
    'psiwFile': '',
    'reactFile': '',
    'compiledFile': '',
    'psiwType': ''
  })

  const { id } = useParams();

  const psiwVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (psiwVideoRef.current) {
      psiwVideoRef.current.src = `${mediaData.compiledFile}#t=0.1`;
    }
  }, [mediaData]);

  const handleVideoClick = () => {
    if (psiwVideoRef.current) {
      if (psiwVideoRef.current.paused) {
        psiwVideoRef.current.play();
      } else {
        psiwVideoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (psiwVideoRef.current) {
      const eventName = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
      document.addEventListener(eventName, handleVideoClick);
    }
  
    return () => {
      if (psiwVideoRef.current) {
        const eventName = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
        document.removeEventListener(eventName, handleVideoClick);
      }
    };
  }, []);

  useEffect(() => {
    getMediaReactData(id as string)
  }, [id])

  const getMediaReactData = async (id: string) => {
    const data = await getMediaReact(id)
    setMediaData(data)
  }

  return (
    <div className="w-screen h-screen">
      <div
        className={`relative flex items-start overflow-hidden bg-gray-100 w-screen h-screen`}
      >
        <div className="w-full">
          <video
            ref={psiwVideoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            controls={false}
            preload="metadata"
            playsInline
          />
        </div>
        <Link to={`/compartilhar-compilado/${id}`} state={{ shareId: id }}>
          <Button className="text-black px-8 py-2 text-2xl border-solid border-2 border-black bg-pink-500 absolute top-4 left-4" text="Compartilhar" />
        </Link>
      </div>
    </div>
  );
}