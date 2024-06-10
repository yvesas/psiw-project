import { InputHTMLAttributes } from "react";

export function TextInput({...rest}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <input className="border-solid text-2xl border-2 border-black p-1 pl-3" type="text" {...rest} />
    </>
  );
}