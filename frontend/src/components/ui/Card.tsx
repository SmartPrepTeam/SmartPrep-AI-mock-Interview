import {ReactNode} from 'react'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface Props extends React.HTMLAttributes<HTMLDivElement>{
    children : ReactNode
}

export const Card = ({className,children,...props}:Props) => {
  return (
    <div className={cn('bg-red',className)} {...props}>
        {children}
    </div>
  )
}

export const CardHeader = ({className,children,...props}:Props) => {
    return (
      <div {...props}>
          {children}
      </div>
    )
  }


export const CardTitle = ({className,children,...props}:Props) => {
    return (
      <div {...props}>
          {children}
      </div>
    )
  }

export const CardDescription = ({className,children,...props}:Props) => {
return (
    <div {...props}>
        {children}
    </div>
)
}
export const CardBody = ({className,children,...props}:Props) => {
    return (
      <div {...props}>
          {children}
      </div>
    )
  }