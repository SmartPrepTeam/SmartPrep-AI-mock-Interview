import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from '@/components/ui/Card';
interface AuthCardProps {
  title: string;
  description: string;
  message: string;
  additionalMessage?: string;
  linkText: string;
  linkHref: string;
  children: ReactNode;
}
const AuthCard = ({
  title,
  description,
  message,
  additionalMessage,
  linkText,
  linkHref,
  children,
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <img alt="logo"></img>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardBody className="w-full">{children}</CardBody>
      <div className="text-center my-4 text-sm text-card-description">
        {message}{' '}
        <Link to={linkHref}>
          <span className="text-primary font-semibold">{linkText}</span>
        </Link>
      </div>
      {additionalMessage && (
        <div className="w-full text-center px-10 text-sm text-card-description">
          {additionalMessage}
        </div>
      )}
    </Card>
  );
};

export default AuthCard;
