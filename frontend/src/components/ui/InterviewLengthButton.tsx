import { Turtle, Footprints, Rocket } from 'lucide-react';
import { useState } from 'react';
interface InterviewLengthButtonProps {
  label: string;
  description: string;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function InterviewLengthButton({
  label,
  description,
  isActive,
  onClick,
}: InterviewLengthButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
      className={`flex-1 p-4 rounded-lg shadow text-left text-md hover:bg-[#a9c6f5] hover:text-slate-950 py-2 px-4 transition duration-200 ease-in-out ${
        isActive
          ? 'bg-[#a9c6f5] text-slate-950 border-2 border-white-100'
          : 'bg-slate-950 text-white border border-white/[0.1]'
      }`}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-1">{label}</h2>
        <div className="flex justify-center items-center my-2">
          {label === 'Long' && (
            <Turtle
              size={30}
              className={`${isHovering && 'text-slate-950'} ${isActive ? 'text-slate-950' : 'text-white'}`}
            />
          )}
          {label === 'Medium' && (
            <Footprints
              size={30}
              className={`${isHovering && 'text-slate-950'} ${isActive ? 'text-slate-950' : 'text-white'}`}
            />
          )}
          {label === 'Short' && (
            <Rocket
              size={30}
              className={`${isHovering && 'text-slate-950'} ${isActive ? 'text-slate-950' : 'text-white'}`}
            />
          )}
        </div>
        <p className="text-sm text-center">{description}</p>
      </div>
    </button>
  );
}
