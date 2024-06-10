import { Button } from "../../components/Button";

import ReactionsImage from '../../assets/reactions.png'
import { LogoBird } from "../../components/svg/LogoBird";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export function ShareReact() {
  const [deleted, setDeleted] = useState(false)

  const { protocol, hostname, port } = window.location

  const location = useLocation()
  const shareId = location.state.shareId

  const url = `${protocol}//${hostname}${port && `:${port}`}/reacao/${shareId}`

  const share = () => {
    window.location.replace(`https://wa.me/?text=${url}`);
  }

  return (
    <div className="flex flex-col items-center pt-8 overflow-hidden w-96 h-full justify-between">
      <div className="flex flex-col w-full gap-8 px-8">
        <div className="w-full flex justify-center">
          <LogoBird width={200} />
        </div>
        <div className="flex flex-col w-full gap-4">
          <h2 className="text-3xl">Tudo pronto!</h2>
          <h2 className="text-3xl text-gray-300">Bora interagir e ver a reação que o seu psiw vai gerar :)</h2>
          <Button onClick={share} color={'bg-green-500'} fullSize={true}  text="Enviar via whatsapp" />
          <Button onClick={()=> {
            window.open(`https://jinxdah.shop:5587/api/download/${shareId}`, '_blank');
          }} color={'bg-yellow-500'} fullSize={true}  text="Salvar no meu smartphone" />
          <Button onClick={() => setDeleted(true)} color={'bg-pink-500'} fullSize={true}  text="Excluir em definitivo" />
          {deleted && <p className="text-center">Excluído com sucesso</p>}
        </div>
      </div>
      <img className="pt-8 h-full object-cover" src={ReactionsImage} alt="" />
    </div>
  );
}

