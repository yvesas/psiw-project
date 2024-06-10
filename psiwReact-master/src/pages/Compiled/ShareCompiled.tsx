import { useState } from "react"
import { useLocation } from "react-router-dom"
import { Button } from "../../components/Button"
import { TextInput } from "../../components/TextInput"
import { LogoBird } from "../../components/svg/LogoBird"

import ReactionsImage from '../../assets/reactions.png'

export function ShareCompiled() {
  const [recipientName, setRecipientName] = useState('')
  const [recipientNumber, setRecipientNumber] = useState('')

  const location = useLocation()
  const shareId = location.state.shareId

  const { protocol, hostname, port } = window.location
  const url = `${protocol}//${hostname}${port && `:${port}`}/reacao/${shareId}`


  const message = `Olá, ${recipientName}%0a${recipientName} acaba de mandar um PSIW para você.%0a*Clique no link abaixo para ver.*%0a${url}/reacao/${shareId}
  `

  const share = () => {
    const phoneNumber = recipientNumber.replace(/\D/g, '')
    window.location.replace(`https://wa.me/${phoneNumber}?text=${message}`);
  }

  const handleRecipientName = (name: string) => {
    setRecipientName(name)
  }

  const handleRecipientNumber = (number: string) => {
    setRecipientNumber(number)
  }

  return (
    <div className="flex flex-col items-center pt-8 overflow-hidden w-96 h-full justify-between">
      <div className="flex flex-col w-full gap-8 px-8">
        <div className="w-full flex justify-center">
          <LogoBird width={200} />
        </div>
        <div className="flex flex-col w-full gap-4">
          <h2 className="text-3xl text-gray-300">Com quem você vai compartilhar esse PSIW?</h2>
          <TextInput
            placeholder="nome do destinatário"
            onChange={(e) => handleRecipientName(e.target.value)}
            value={recipientName}
          />
          <TextInput
            placeholder="seu whatsapp"
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              const maskedValue = rawValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
              if(rawValue.length <= 11)
              handleRecipientNumber(maskedValue);
            }}
            value={recipientNumber}
            type="tel"
          />
          <Button onClick={share} color={'bg-green-500'} fullSize={true}  text="Enviar via whatsapp" />
          {/* <Button onClick={()=> {
            window.open(`https://jinxdah.shop:5587/api/download/${shareId}`, '_blank');
          }} color={'bg-yellow-500'} fullSize={true}  text="Salvar no meu smartphone" /> */}
        </div>
      </div>
      <img className="pt-8 h-full object-cover" src={ReactionsImage} alt="" />
    </div>
  );
}