import { useLocation, useNavigate, useParams } from "react-router-dom";

import { sendReact } from "../../services/requests"
import { LogoBird } from "../../components/svg/LogoBird";

export function Loading() {

  const location = useLocation()
  const navigate = useNavigate()
  const videoBlob = location.state.video
  const mediaData = location.state.mediaData

  const { id } = useParams();

  const uploadVideo = async (videoBlob: Blob) => {
    console.log("Uploading video, size:", videoBlob.size);
    const formData = new FormData();
    if (mediaData?.psiwId) {
      formData.append("psiwId", mediaData?.psiwId);
      formData.append("reactedFiles", videoBlob, "capturedVideo.webm");
    }
    try {
      const shareId = await sendReact(formData);
      if (shareId.length > 0) {
        navigate(`/compartilhar-react/${id}`, { state: { shareId } })
        console.log(id)
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  uploadVideo(videoBlob)
  return (
    <div className="flex relative flex-col w-full gap-8 px-8 pt-8">
        <div className="w-full flex justify-center">
          <LogoBird width={200} />
        </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl">Aguarde um pouquinho :)</h3>
        <p className="text-2xl w-3/4">Estamos compilando o video para te mostrar como ficou.</p>
        <div className="flex justify-center">
          <div className="w-28 motion-safe:animate-spin ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FE778D" viewBox="0 0 256 256"><path d="M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm84,84H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z"></path></svg>
          </div>
        </div>
        <p className="w-3/4">Como esta é uma versão alpha do psiw, esse processo pode demorar um pouco.</p>
        <p className="w-2/4 text-sm">Se essa tela for fechada antes do carregamento, você perderá a reação gravada</p>
      </div>
    </div>
  );
}

