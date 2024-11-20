import AuthContainer from '@/components/ui/AuthContainer'
import { SubmitHandler} from 'react-hook-form'
import {FormFields} from '@/components/ui/AuthContainer'
const LoginForm = () => {
    const handleLogin : SubmitHandler<FormFields> = (data)=>{
        console.log(data)
    }
  return (
    <>
    <AuthContainer 
    title='Welcome Back' 
    loadingState='Logging in...' 
    buttonText='Login' 
    description='Log in to your account'
    message = "Don't have an account"
    linkText='Sign Up'
    linkHref='/signup'
    onSubmit = {handleLogin}
    />
    </>
  )
}

export default LoginForm