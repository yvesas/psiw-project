import { ChangeEvent, useState } from "react";
import { useNavigate } from 'react-router-dom'

import { Button } from "../../components/Button";
import { BirdColor } from "../../components/svg/BirdColor";
import { useLocation } from "react-router-dom";
import { sendForm } from "../../services/requests";

export function PsiwUpload() {
  const location = useLocation()
  const locationState = location.state.formData
  const [formData, setFormData] = useState(locationState)
  const [fileName, setFileName] = useState<string>('');
  const [isSendForm, setIsSendForm] = useState(false);

  const navigate = useNavigate();

  const color = formData.psiwType

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    const newFileName = file ? file.name : ''
    setFileName(newFileName)
    setFormData({...formData, file: file })
  };

  const handlePage = async () => {
    setIsSendForm(true);
    const psiwFormData = new FormData();
    psiwFormData.append('senderName', formData.senderName)
    psiwFormData.append('senderWhatsapp', formData.senderWhatsapp)
    psiwFormData.append('recipientName', formData.recipientName)
    psiwFormData.append('recipientWhatsapp', formData.recipientWhatsapp)
    psiwFormData.append('psiwType', formData.psiwType)
    if (formData.file) {
      console.log(formData.file)
      psiwFormData.append('viewedFile', formData.file);
    }else {
      console.log(formData.file)
    }
    
    const id = await sendForm(psiwFormData);
    if(id){
      console.log(id)
      setFormData({...formData, psiwId: id });
      navigate('/compartilhar', { state: { formData, id } })

    }else{
      console.log('Error in sendForm on handlePage. No Id.')
      // handlePageChange(4)
    }
    
  }

  return (
    <div className="flex relative flex-col items-center w-screen h-screen bg-blue-bird bg-no-repeat bg-cover bg-bird-position bg-fixed">
      <div className="flex flex-col items-center py-16 gap-8">
        <div className="flex justify-start w-full">
          <BirdColor color={color} width={88} height={88}/>
        </div>
        <div className="flex flex-col w-80 gap-4">
          <h2 className="text-3xl">Carregue seu psiw<br />em vídeo ou imagem</h2>
          <div>
            <div className="flex flex-col">
              <input
                type="file"
                id="file-input"
                accept="image/*, video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                className='w-full'
                htmlFor="file-input">
                <p
                  className={`text-black bg-yellow-500 cursor-pointer text-center px-8 w-5/6 py-2 text-2xl border-solid border-2 border-black`}
                >
                  Buscar arquivo
                </p>
              </label>
              {
                fileName && 
                <div className="flex gap-4">
                  <span>{fileName}</span>
                  <span>Arquivo carregado</span>
                </div>
              }
              
            </div>
          </div>
          {
            !isSendForm ?
            <Button onClick={handlePage} text="proximo" />
            :
            <Button disabled onClick={handlePage} loading text={`Enviando o Arquivo`} />
          }
        </div>
      </div>
    </div>
  );
}

