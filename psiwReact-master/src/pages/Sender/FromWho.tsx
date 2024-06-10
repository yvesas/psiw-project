import { ChangeEvent, useState } from "react";

import { Button } from "../../components/Button";
import { CheckboxInput } from "../../components/CheckboxInput";
import { TextInput } from "../../components/TextInput";
import { PsiwText } from "../../components/svg/PsiwText";
import { PsiwType } from "../../interfaces/psiw";

import Logo from '../../assets/logo-psiw.svg'
import { Link } from "react-router-dom";
import { BottomBird } from "../../components/BottomBird";

export function FromWho() {
  const [selectedPsiw, setSelectedPsiw] = useState<PsiwType>('presente');
  const [formData, setFormData] = useState({
    psiwId: "",
    senderName: "",
    senderWhatsapp: "",
    psiwType: "presente" as PsiwType,
    recipientName: "",
    recipientWhatsapp: "",
    file: null as File | null
  })

  const handleChangeCheckbox = (id: PsiwType) => {
    if (id !== selectedPsiw) {
      console.log(id)
      setSelectedPsiw(id);
      setFormData({
        ...formData,
        psiwType: id,
      });
    }
  }

  const handleSenderName = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, senderName: e.target.value });
  }

  const handleSenderNumber = (number: string) => {
    setFormData({...formData, senderWhatsapp: number });
  }

  return (
    <div className="flex relative flex-col items-center w-screen h-screen bg-blue-bird bg-no-repeat bg-cover bg-bird-position bg-fixed">
      <div className="flex flex-col items-center py-8">
        <img className="w-32 mb-8" src={Logo} alt="" />
        <div className="flex flex-col w-80 gap-6">
          <h2 className="text-3xl w-4/6">Qual psiw você vai mandar hoje?</h2>
          <div className="flex flex-col gap-4">
            <div className="flex w-3/6 justify-between">
              <CheckboxInput
                id="presente"
                color="presente"
                handleChangeCheckbox={handleChangeCheckbox}
                selected={selectedPsiw === 'presente'}
              />
              <CheckboxInput
                id="sentimento"
                color="sentimento"
                handleChangeCheckbox={handleChangeCheckbox}
                selected={selectedPsiw === 'sentimento'}
              />
              <CheckboxInput
                id="indagacao"
                color="indagacao"
                handleChangeCheckbox={handleChangeCheckbox}
                selected={selectedPsiw === 'indagacao'}
              />
              <CheckboxInput
                id="wow"
                color="wow"
                handleChangeCheckbox={handleChangeCheckbox}
                selected={selectedPsiw === 'wow'}
              />
            </div>
            <div className="w-24 h-4">
              <PsiwText psiwType={selectedPsiw} />
            </div>
          </div>
          <div className="flex flex-col w-10/12 gap-2">
            <h2 className="text-2xl">Preencha seus dados</h2>
            <TextInput
              placeholder="seu nome"
              onChange={handleSenderName}
              value={formData.senderName}
              required
            />
            <TextInput
              placeholder="seu whatsapp"
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '');
                const maskedValue = rawValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if(rawValue.length <= 11)
                  handleSenderNumber(maskedValue)
              }}
              value={formData.senderWhatsapp}
              type="tel"
              required
            />
          </div>
          <Link to="/para-quem" state={{ formData }}>
            <Button text="proximo" />
          </Link>
        </div>
      </div> 
      <BottomBird colors={selectedPsiw} />
    </div>
  );
}