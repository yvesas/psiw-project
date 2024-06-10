import { InputHTMLAttributes } from "react";
import { BirdColor } from "./svg/BirdColor"
import { PsiwType } from "../interfaces/psiw";

interface CheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  color: 'presente' | 'sentimento' | 'indagacao' | 'wow';
  handleChangeCheckbox: (text: PsiwType) => void;
  selected?: boolean;
}

export function CheckboxInput({ color, handleChangeCheckbox, selected, ...rest }: CheckboxInputProps) {
  const onChangeColor = () => {
    if (rest.id && (rest.id === 'presente' || rest.id === 'sentimento' || rest.id === 'indagacao' || rest.id === 'wow')) {
      handleChangeCheckbox(rest.id);
    }
  };
  
  return (
    <div>
      <label className={`flex gap-2 items-center cursor-pointer ${!selected ? 'opacity-60': ''}`} htmlFor={rest.id}>
        <BirdColor color={color} width={32} height={32}/>
      </label>
      <input
        className="hidden"
        type="checkbox"
        name="" {...rest }
        onChange={onChangeColor}
        checked={selected}
      />
    </div>
  );
}

