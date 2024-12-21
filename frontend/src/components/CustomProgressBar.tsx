import { CustomProgressBarProps } from '@/types/componentTypes';
import { Progress } from './ui/Progress';

const CustomProgressBar = ({
  headings,
  markers,
  values,
}: CustomProgressBarProps) => {
  return (
    <div className="p-6 w-full h-full flex flex-col justify-center gap-4 border border-white/[0.1] bg-[#10132E] rounded-lg shadow-md">
      <h2 className="text-center text-lg font-semibold mb-6">{headings}</h2>

      <Progress value={(values / 10) * 100}></Progress>
      <div className="flex justify-between text-sm md:text-[xs] lg:text-sm mt-2">
        <span>{markers.left}</span>
        <span>{markers.middle}</span>
        <span>{markers.right}</span>
      </div>
    </div>
  );
};

export default CustomProgressBar;
