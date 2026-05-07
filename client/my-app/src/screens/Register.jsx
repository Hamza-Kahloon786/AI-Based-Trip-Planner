import React from 'react'
import InputField from '../components/InputField.jsx'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../hooks/hooks.js'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterSchema } from '../constant/YupSchema.js'

function Register() {
    const navigate = useNavigate()
    const { mutateAsync } = useRegister()
    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(RegisterSchema),
      mode: "onChange",
    })

  const onSubmit = async(data) => {
    const result =  await mutateAsync(data)
    if(result.status === 201 && result.ok){
      navigate("/otp")
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 flex items-center justify-center">
      <div className="relative w-full max-w-md mt-12 ">
        
        <div className="relative backdrop-blur-xl   bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl shadow-blue-500/10 border border-white/40 dark:border-white/10 overflow-hidden">
           <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500"></div>
          
          <div className="p-8 ">
             <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
                <span className="text-2xl">✈️</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Join AI Trip Planner and start your journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <div className="group">
                <InputField
                  label="Full Name"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  leadingIcon={<span className="text-blue-500">👤</span>}
                  className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 group-hover:border-blue-400"
                  {...register("name")}
                  error={errors?.name?.message}
                />
              </div>

              <div className="group">
                <InputField
                  label="Email Address"
                  type="email"
                  id="reg-email"
                  name="email"
                  placeholder="couple@example.com"
                  leadingIcon={<span className="text-green-500">📧</span>}
                  className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/30 group-hover:border-green-400"
                  {...register("email")}
                  error={errors?.email?.message}
                />
              </div>

              <div className="group">
                <InputField
                  label="Password"
                  type="password"
                  id="reg-password"
                  name="password"
                  placeholder="••••••••"
                  leadingIcon={<span className="text-orange-500">🔒</span>}
                  className="transition-all duration-300 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 group-hover:border-orange-400"
                  {...register("password")}
                  error={errors?.password?.message}
                />
              </div>

               <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="terms"
                    className="peer h-5 w-5 appearance-none rounded border border-gray-300 dark:border-gray-600 checked:border-blue-500 checked:bg-blue-500 transition-all duration-200 cursor-pointer"
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200">
                    ✓
                  </div>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  I agree to the <span className="text-blue-500 hover:text-blue-600 transition-colors">Terms of Service</span> and <span className="text-blue-500 hover:text-blue-600 transition-colors">Privacy Policy</span>
                </label>
               </div>
               
              <button
                type="submit"
                className="w-full mt-4 cursor-pointer px-4 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform "
              >
                Create Account
              </button>
            </form>

             <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              {/* <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div> */}
            </div>

             {/* <button
              type="button"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md"
            >
              <span className="text-xl">G</span>
              <span>Sign up with Google</span>
            </button> */}

             <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <div  onClick={()=>navigate("/login") } className="text-blue-500 cursor-pointer hover:text-blue-600 font-semibold transition-colors">
                  Sign In
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
