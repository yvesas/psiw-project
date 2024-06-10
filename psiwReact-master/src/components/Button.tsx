import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  color?: string;
  fullSize?: boolean;
  loading?: boolean;
}

export function Button({ text, color ="bg-green-500", loading, fullSize, ...rest }: ButtonProps) {
  return (
    <>
      <button
        className={`text-black flex items-center gap-2 justify-center px-8 py-2 text-2xl border-solid border-2 border-black ${color} ${fullSize ? "w-full": "w-5/6"}`}
        {...rest}
      >
        {text}
        {
          loading && 
          <div className="w-6 -mt-1 motion-safe:animate-spin ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="0 0 256 256"><path d="M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm84,84H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z"></path></svg>
          </div>
        }
      </button>
    </>
  );
}