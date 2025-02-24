import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-3xl text-white text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">{children}</CardContent>
      <div className="text-center my-4 text-sm text-card-description">
        {message}{' '}
        <Link to={linkHref}>
          <span className="text-[#a9c6f5] font-semibold">{linkText}</span>
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
