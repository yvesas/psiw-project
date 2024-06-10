import { PsiwType } from "../interfaces/psiwType";
import { BirdColor } from "./svg/BirdColor";

export function BottomBird({ colors }: PsiwType) {
  return (
    <div className="fixed -bottom-2 -z-10 opacity-20">
      <BirdColor color={colors} height={360} removeStroke />
    </div>
  );
}

