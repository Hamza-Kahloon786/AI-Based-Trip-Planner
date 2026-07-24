import React, { useState,useEffect } from "react";
import InputField from "../components/InputField.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../constant/YupSchema.js";
import { useForgotPassword,useResetPassword } from "../hooks/hooks.js"
import { useSelector } from "react-redux";
import { userData } from "../redux/slice/authSlice.js";



function ForgotPassword() {
  const location = useLocation();
  const fromPage = location.state?.from || "";
  const navigate = useNavigate();
  const currentStep = fromPage === "otp" ? 2 : 1;
  const [step, setStep] = useState(currentStep);
  const { mutateAsync: forgotPasswordAsync } = useForgotPassword()
  const { mutateAsync: resetPasswordAsync } = useResetPassword()
  const user = useSelector(userData)

useEffect(() => {
  console.log("Updated user:", user)
}, [user])


  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const moveOtpScreen = async (data) => {
    const result = await forgotPasswordAsync(data)
    if (result?.status === 200 && result?.ok === true) {
      navigate("/otp", { state: { from: "forgot-password" } });
    }
  }

  const resetPassword = async (data) => {
    const result = await resetPasswordAsync(data)

    if (result?.status === 200 && result?.ok === true) {
      navigate("/login", { state: { from: "reset-password" } });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-32 right-0 w-[36rem] h-[36rem] rounded-full bg-indigo-600/25 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-[32rem] h-[32rem] rounded-full bg-violet-600/20 blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-md mt-4">

        <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10 overflow-hidden">

          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"></div>

          <div className="p-8">

            {/* Header */}
            <div className="text-center mb-8">

              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h2 className="font-display text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Forgot Password
              </h2>

              <p className="text-slate-500 mt-2 text-sm">
                Reset your AI Trip Planner password
              </p>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <form className="space-y-6" onSubmit={handleSubmitEmail(moveOtpScreen)}>

                <div className="group">
                  <InputField
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    {...registerEmail("email")}
                    error={emailErrors?.email?.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                >
                  Continue
                </button>

              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form className="space-y-6" onSubmit={handleSubmitReset(resetPassword)}>

                <div className="group">
                  <InputField
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    {...registerReset("password")}
                    error={resetErrors?.password?.message}
                  />
                </div>

                <div className="group">
                  <InputField
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    {...registerReset("confirmPassword")}
                    error={resetErrors?.confirmPassword?.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 px-4 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                >
                  Reset Password
                </button>

                {/* <div
                  onClick={() => setStep(1)}
                  className="text-center cursor-pointer text-sm text-gray-500 hover:text-pink-500"
                >
                  Back
                </div> */}

              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Remember your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Sign In
                </span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
