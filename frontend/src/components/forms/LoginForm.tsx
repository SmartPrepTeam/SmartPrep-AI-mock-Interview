import AuthContainer from '@/components/ui/AuthContainer';
import { SubmitHandler } from 'react-hook-form';
import { FormFields } from '@/components/ui/AuthContainer';
import { ENDPOINTS } from '@/api/api-config';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/context/auth_context';

const LoginForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await axios.post(ENDPOINTS.auth.login, data);
      auth?.setToken(res.data.access_token);
      auth?.setUserId(res.data.user_id);
      toast.success('Logged in Successfully');
      navigate('/home');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        toast.error(e.response?.data.message || 'An unexpected error occured');
      } else {
        toast.error('An unexpected error occured');
      }
    }
  };

  return (
    <>
      <AuthContainer
        title="Welcome Back"
        loadingState="Logging in..."
        buttonText="Login"
        description="Log in to your account"
        message="Don't have an account"
        linkText="Sign Up"
        linkHref="/signup"
        onSubmit={handleLogin}
      />
    </>
  );
};

export default LoginForm;
