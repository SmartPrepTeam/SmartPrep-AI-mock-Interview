// import React from 'react'
import AuthCard from '@/components/ui/AuthCard'
import {z} from 'zod'
import {useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import img from '@/assets/Illustration.svg'

const schema = z.object({
    email : z.string().email("Invalid email address"),
    password : z.string().min(8, "Password must be at least 8 characters")
})
type FormFields = z.infer<typeof schema>
const SignupForm = () => {
    const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm<FormFields>({
        resolver : zodResolver(schema),
        defaultValues : {
            email : "",
            password : ""
        }
    })
    const onSubmit : SubmitHandler<FormFields> = (data)=>{
        console.log(data)
    }
  return (
    <div className='flex w-full h-screen justify-center items-center font-Manrope'>
        <div className='w-1/2 flex justify-center items-center'>
    <AuthCard
        title = "Join SmartPrep"
        description = "Create your account"
        message = "Already have an account?"
        additionalMessage = "By signing up, you agree to our Terms of Service and Privacy Policy."
        linkText = "Log in"
        linkHref = "/login"
    >
        <form onSubmit={handleSubmit(onSubmit)}>
            <label 
            htmlFor='email' 
            className="block mb-2">
            Email Address
            </label>
            <input {...register("email")} id='email' placeholder='Email' className='border p-2 mb-2 w-full rounded-lg'/>
            {errors.email && <div>{errors.email?.message}</div>}
            <label htmlFor='password' className="block mb-2">Password</label>
            <input {...register("password")} id='password' placeholder='Password' className='border p-2 mb-2 w-full rounded-lg'/>
            {errors.password && <div>{errors.password?.message}</div>}
            <button 
            disabled={isSubmitting}>
            {isSubmitting ?"Submitting" : "Sign up" }
            </button>
            {errors.root && <div>{errors.root?.message}</div>}
        </form>
    </AuthCard>
    </div>
        <div className='w-1/2 flex justify-center items-center'>
            <img src={img} 
            loading='lazy'
            alt="Illustration"
            className="w-[300px] h-[400px] object-contain md:w-[200px] md:h-[550px] lg:w-[550px] lg:h-[800px]"
            ></img>
        </div>
    </div>
  )
}

export default SignupForm