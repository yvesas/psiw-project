import { useLocation } from "react-router-dom"
import { Button } from "../../components/Button"
import { LogoBird } from "../../components/svg/LogoBird"

import ReactionsImage from '../../assets/reactions.png'

export function Share() {
  const location = useLocation()
  const formData = location.state.formData
  const id = location.state.id

  console.log(id)

  const { protocol, hostname, port } = window.location
  const url = `${protocol}//${hostname}${port && `:${port}`}`

  console.log(formData)

  const message = `Olá, ${formData.recipientName}%0a${formData.senderName} acaba de mandar um PSIW para você.%0a*Clique no link abaixo para ver.*%0a${url}/ver-psiw/${id}
  `
  const share = () => {
    const phoneNumber = formData.recipientWhatsapp.replace(/\D/g, '')
    window.location.replace(`https://wa.me/${phoneNumber}?text=${message}`);
  }

  return (
    <div className="flex relative flex-col items-center w-screen h-screen bg-blue-bird bg-no-repeat bg-cover bg-bird-position bg-fixed">
      <div className="flex flex-col items-center pt-8 overflow-hidden w-96 h-full justify-between">
        <div className="flex flex-col w-full gap-8 px-8">
          <div className="w-full flex justify-center">
            <LogoBird width={200} />
          </div>
          <div className="flex flex-col w-full gap-4">
            <h2 className="text-3xl">Tudo pronto!</h2>
            <h2 className="text-3xl text-gray-300">Bora interagir e ver a reação que o seu psiw vai gerar :)</h2>
            <Button onClick={share} color="bg-green-500" text="Enviar via whatsapp" />
          </div>
        </div>
        <img className="pt-8 h-full object-cover" src={ReactionsImage} alt="" />
      </div>
    </div>
  );
}

