import { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"

import { MediaData } from "../../interfaces/psiw";

import { getMediaPsiw } from "../../services/requests"

interface MediaDataProps extends MediaData {
  senderName: string;
  recipientName: string;
}

import { Button } from '../../components/Button'

import Logo from '../../assets/logo-psiw.svg'

export function SeePsiw() {
  const [mediaData, setMediaData] = useState<MediaDataProps>({
    psiwId: '',
    psiwType: 'presente',
    viewedFile: '',
    senderName: '',
    recipientName: ''
  })

  const { id } = useParams();

  useEffect(() => {
    getMediaPsiw(id as string)
      .then((data) => {
        console.log(data)
        const {id, psiwType, viewedFile, senderName, recipientName} = data;
        setMediaData({
          psiwId: id,
          psiwType,
          viewedFile,
          senderName,
          recipientName
        })
      })
      .catch(() => console.log('Video not found'))
  }, [id])

  useEffect(() => {

  }, [])


  return (
    <div className="flex flex-col items-center py-8">
      <img className="w-32 mb-8" src={Logo} alt="" />
      <div className="flex flex-col w-80 gap-6">
        <h2 className="text-3xl w-4/6">
          {mediaData.recipientName}, clique abaixo para ver o psiw que {mediaData.senderName} mandou para você :)
        </h2>
        <Link to={`/reagir/${id}`} state={{ mediaData }}>
          <Button color="bg-pink-500" text="Ver meu psiw" />
        </Link>
        
        <div className="flex flex-col w-10/12 gap-2">
          <p>
            Será solicitado acesso à câmera frontal do seu smartphone para gravar sua reação
          </p>
          <p>Após gravar sua reação, você poderá:</p>
          <p>- Compartilhar com quem quiser;</p>
          <p>- Salvar só para você;</p>
          <p>- ou Excluir em definitivo;</p>
        </div>
      </div>
      
    </div>
  );
}
