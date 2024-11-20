import {ReactNode} from 'react'
import {Link} from 'react-router-dom'
import {Card,CardHeader,CardTitle,CardDescription,CardBody} from '@/components/ui/Card'
interface AuthCardProps {
    title : string
    description : string
    message : string
    additionalMessage?: string
    linkText : string
    linkHref : string
    children : ReactNode
}
const AuthCard = ({title,description,message,additionalMessage,linkText,linkHref,children}:AuthCardProps) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardBody>
            {children}
        </CardBody>
        <div>
            {message}{" "}
            <Link to={linkHref}>
            {linkText}
            </Link>
        </div>
        {additionalMessage && <div>{additionalMessage}</div>}
    </Card>

  )
}

export default AuthCard