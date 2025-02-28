// import React from 'react'
import AuthCard from '@/components/ui/AuthCard';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import img from '/Login.svg';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().trim().min(8, 'Password must be at least 8 characters'),
});
export type FormFields = z.infer<typeof schema>;
interface AuthContainerProps {
  loadingState: string;
  buttonText: string;
  title: string;
  additionalMessage?: string;
  description: string;
  message: string;
  linkText: string;
  linkHref: string;
  onSubmit: SubmitHandler<FormFields>;
}
const AuthContainer = ({
  loadingState,
  buttonText,
  onSubmit,
  ...props
}: AuthContainerProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);
  const handleHomeNavigation = () => {
    navigate('/home');
  };
  return (
    <div className="flex min-h-screen justify-center items-center font-Manrope bg-black-100 p-2">
      <div className="w-full lg:w-1/2 ">
        <AuthCard {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-white"
            >
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              placeholder="Email"
              className="border-2 border-secondaryPurple p-2 mb-1 w-full rounded-lg bg-white text-black"
            />
            {errors.email && (
              <div className="text-red-600">{errors.email?.message}</div>
            )}
            <label
              htmlFor="password"
              className="block mt-5 2 font-semibold text-white"
            >
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              placeholder="Password"
              type="password"
              className="border-2 border-secondaryPurple p-2 mt-2 w-full rounded-lg bg-white text-black"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password?.message}</div>
            )}
            <button
              disabled={isSubmitting}
              className="w-full p-2 rounded-xl text-center text-white mt-8 bg-[#759edf]"
            >
              {isSubmitting ? loadingState : buttonText}
            </button>
            {errors.root && (
              <div className="text-red-600">{errors.root?.message}</div>
            )}
          </form>
        </AuthCard>
      </div>
      <div
        className="hidden lg:flex lg:w-1/2 rounded-xl border border-white/[0.1] shadow h-[95vh] justify-center items-center"
        style={{
          background: 'rgb(4,7,29)',
          backgroundColor:
            'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
        }}
      >
        <img src={img} alt="" className="lg:w-9/12" />
      </div>
    </div>
  );
};

export default AuthContainer;
