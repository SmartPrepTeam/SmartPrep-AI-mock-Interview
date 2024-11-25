// import React from 'react'
import AuthCard from '@/components/ui/AuthCard';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import img from '@/assets/Illustration.svg';
import { useEffect } from 'react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
  return (
    <div className="flex w-full h-screen justify-center items-center font-Manrope">
      <div className="w-1/2 flex justify-center items-center">
        <AuthCard {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              placeholder="Email"
              className="border-2 border-secondary p-2 mb-1 w-full rounded-lg"
            />
            {errors.email && (
              <div className="text-red-600">{errors.email?.message}</div>
            )}
            <label htmlFor="password" className="block mt-5 2 font-semibold">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              placeholder="Password"
              type="password"
              className="border-2 border-secondary p-2 mt-2 w-full rounded-lg"
            />
            {errors.password && (
              <div className="text-red-600">{errors.password?.message}</div>
            )}
            <button
              disabled={isSubmitting}
              className="w-full p-2 rounded-xl text-center text-white mt-8 bg-primary"
            >
              {isSubmitting ? loadingState : buttonText}
            </button>
            {errors.root && (
              <div className="text-red-600">{errors.root?.message}</div>
            )}
          </form>
        </AuthCard>
      </div>
      <div className="w-1/2 h-full flex justify-center items-center bg-gradient-to-br from-[#6f42f5] to-[#a78bfa]">
        <img
          src={img}
          loading="lazy"
          alt="Illustration"
          className="w-[300px] h-[400px] object-contain md:w-[200px] md:h-[550px] lg:w-[550px] lg:h-[800px]"
        ></img>
      </div>
    </div>
  );
};

export default AuthContainer;
