import AuthContainer from '@/components/ui/AuthContainer';
import { SubmitHandler } from 'react-hook-form';
import { FormFields } from '@/components/ui/AuthContainer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/features/apiSlice';
import { useDispatch } from 'react-redux';
import { setToken, setUserId } from '@/features/authSlice';
const LoginForm = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const handleLogin: SubmitHandler<FormFields> = async (data) => {
    try {
      const res = await login(data).unwrap();
      console.log(res);
      const dispatch = useDispatch();
      dispatch(setToken(res.data.access_token));
      dispatch(setUserId(res.data.user_id));
      toast.success('Logged in Successfully');
      navigate('/resume');
    } catch (e: any) {
      if (e.status === 400) {
        toast.error('Error : Invalid credentials');
      } else if (e.data?.message) {
        toast.error(`Error : ${e.data?.message}`);
      } else if (axios.isAxiosError(e)) {
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
