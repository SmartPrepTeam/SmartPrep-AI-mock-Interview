import AuthContainer from '@/components/ui/AuthContainer';
import { SubmitHandler } from 'react-hook-form';
import { FormFields } from '@/components/ui/AuthContainer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSignupMutation } from '@/features/apiSlice';

const SignupForm = () => {
  const navigate = useNavigate();
  const [signup] = useSignupMutation();
  const handleSignup: SubmitHandler<FormFields> = async (data) => {
    try {
      await signup(data).unwrap();
      toast.success('Signed up successfully');
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || 'An unexpected Error occured';
        toast.error(`Error : ${errorMessage}`);
      } else {
        toast.error('An unexpected Error occured');
      }
    }
  };
  return (
    <>
      <AuthContainer
        loadingState="Signing up..."
        buttonText="Sign up"
        title="Join SmartPrep"
        description="Create your account"
        message="Already have an account?"
        additionalMessage="By signing up, you agree to our Terms of Service and Privacy Policy."
        linkText="Log In"
        linkHref="/login"
        onSubmit={handleSignup}
      />
    </>
  );
};

export default SignupForm;
