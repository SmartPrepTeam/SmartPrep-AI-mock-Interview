// import React from 'react'
import AuthCard from '@/components/ui/AuthCard'
import {z} from 'zod'
import {useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
    <AuthCard
        title = "Join SmartPrep"
        description = "Create your account"
        message = "Already have an account?"
        additionalMessage = "By signing up, you agree to our Terms of Service and Privacy Policy."
        linkText = "Log in"
        linkHref = "/login"
    >
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='email'>Email Address</label>
            <input {...register("email")} id='email' placeholder='Email'/>
            {errors.email && <div>{errors.email?.message}</div>}
            <label htmlFor='password'>Password</label>
            <input {...register("password")} id='password' placeholder='Password'/>
            {errors.password && <div>{errors.password?.message}</div>}
            <button disabled={isSubmitting}>{isSubmitting ? "Sign up" : "Submitting"}</button>
            {errors.root && <div>{errors.root?.message}</div>}
        </form>
    </AuthCard>
  )
}

export default SignupForm