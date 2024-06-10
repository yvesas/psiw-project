import { ChangeEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from "../../components/Button";
import { TextInput } from "../../components/TextInput";
import { BirdColor } from "../../components/svg/BirdColor";
import { BottomBird } from '../../components/BottomBird';

export function ForWhom() {
  const location = useLocation()
  const locationState = location.state.formData
  const [formData, setFormData] = useState(locationState)

  const handleRecipientName = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, recipientName: e.target.value });
  }
  
  const handleRecipientNumber = (number: string) => {
    setFormData({...formData, recipientWhatsapp: number });
  }

  const color = formData.psiwType

  return (
    <div className="flex relative flex-col items-center w-screen h-screen bg-blue-bird bg-no-repeat bg-cover bg-bird-position bg-fixed">
      <div className="flex flex-col items-center py-16 gap-8">
        <div className="flex justify-start w-full">
          <BirdColor color={color} width={88} height={88}/>
        </div>
        <div className="flex flex-col w-80 gap-4">
          <h2 className="text-3xl">Seu psiw vai para quem?</h2>
          <TextInput
            placeholder="nome do destinatário"
            onChange={handleRecipientName}
            value={formData.recipientName}
          />
          <TextInput
            placeholder="whatsapp do destinatário"
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, '');
              const maskedValue = rawValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
              if(rawValue.length <= 11)
                handleRecipientNumber(maskedValue);
            }}
            value={formData.recipientWhatsapp}
            type="tel"
          />
          <Link to="/escolher-arquivo" state={{ formData }}>
            <Button text="proximo" />
          </Link>
        </div>
      </div>
      <BottomBird colors={color} />
    </div>
  );
}

