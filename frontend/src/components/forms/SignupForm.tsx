import AuthContainer from '@/components/ui/AuthContainer'
import { SubmitHandler} from 'react-hook-form'
import {FormFields} from '@/components/ui/AuthContainer'
import { ENDPOINTS } from '@/api-config'
import axios from 'axios'


const SignupForm = () => {
    const handleSignup : SubmitHandler<FormFields> = (data)=>{
        
    }
  return (
    <>
    <AuthContainer 
    loadingState='Signing up...' 
    buttonText='Sign up' 
    title = "Join SmartPrep"
    description = "Create your account"
    message = "Already have an account?"
    additionalMessage = "By signing up, you agree to our Terms of Service and Privacy Policy."
    linkText = "Log In"
    linkHref = "/login"
    onSubmit = {handleSignup}
    />
    </>
  )
}

export default SignupForm