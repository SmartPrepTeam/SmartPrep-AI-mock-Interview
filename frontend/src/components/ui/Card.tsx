import {ReactNode} from 'react'

type Props = {
    children : ReactNode
}
export const Card = ({children}:Props) => {
  return (
    <div>
        {children}
    </div>
  )
}

export const CardHeader = ({children}:Props) => {
    return (
      <div>
          {children}
      </div>
    )
  }


export const CardTitle = ({children}: Props) => {
    return (
      <div>
          {children}
      </div>
    )
  }

export const CardDescription = ({children} : Props) => {
return (
    <div>
        {children}
    </div>
)
}
export const CardBody = ({children} : Props) => {
    return (
      <div>
          {children}
      </div>
    )
  }