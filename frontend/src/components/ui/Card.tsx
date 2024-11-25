import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className, children, ...props }: Props) => {
  return (
    <div className="w-2/5" {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: Props) => {
  return (
    <div className="text-center" {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className, children, ...props }: Props) => {
  return (
    <div className="text-2xl font-bold mb-2" {...props}>
      {children}
    </div>
  );
};

export const CardDescription = ({ className, children, ...props }: Props) => {
  return (
    <div className="text-card-description mb-6 text-sm" {...props}>
      {children}
    </div>
  );
};
export const CardBody = ({ className, children, ...props }: Props) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
