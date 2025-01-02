import AuthContainer from '@/components/ui/AuthContainer';
import { SubmitHandler } from 'react-hook-form';
import { FormFields } from '@/components/ui/AuthContainer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/context/auth_context';
import { useLoginMutation } from '@/features/apiSlice';
const LoginForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await login(data).unwrap();
      auth?.setToken(res.data.data.access_token);
      auth?.setUserId(res.data.data.user_id);
      toast.success('Logged in Successfully');
      navigate('/home');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 400) {
          toast.error('Error : Invalid credentials');
        } else {
          const errorMessage =
            e.response?.data?.message || 'Unexpected Error occured';
          toast.error(`Error : ${errorMessage}`);
        }
      } else {
        toast.error('An unexpected Error occured');
      }
    }
  };
  if (isLoading) return <div>Loading ....</div>;
  if (isError)
    return <div>Error : {error.data?.message || 'Unknown Error'}</div>;
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
