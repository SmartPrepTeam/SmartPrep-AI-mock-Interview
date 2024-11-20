import AuthContainer from '@/components/ui/AuthContainer'
import { SubmitHandler} from 'react-hook-form'
import {FormFields} from '@/components/ui/AuthContainer'
import { ENDPOINTS } from '@/api-config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SignupForm = () => {
    const navigate = useNavigate()
    const handleSignup : SubmitHandler<FormFields> = async(data)=>{
        try{
            const res = await axios.post(ENDPOINTS.auth.signup,data)
            toast('Signed up successfully')
            navigate('/login')
        }
        catch(err){
            if(axios.isAxiosError(err)){
                const errorMessage = err.response?.data?.message || "An unexpected Error occured"
                toast(`Error : ${errorMessage}`)
            }
            else{
                toast("An unexpected Error occured")
            }
        }
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