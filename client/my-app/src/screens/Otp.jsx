import React, { useState, useRef, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import { useVerifyOtp, useReSendOtp } from "../hooks/hooks";  



function Otp() {
  const navigate = useNavigate();
  const { mutateAsync } = useVerifyOtp();
  const { mutateAsync: resendOtpAsync } = useReSendOtp();
  const location = useLocation()
  const string = ["", "", "", "", "", ""];
  const refData = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const [input, setInput] = useState(string);

  useEffect(() => {
    refData[0].current.focus();
  }, []);

  const fromPage = location?.state?.from || ''


  const getUserInput = (e, index) => {
    const value = e.target.value;
    const regularExpression = /^[0-9]/;
    const regularExpressionResult = regularExpression.test(value);

    if (!regularExpressionResult) {
      return null;
    }
    const inputCopy = [...input];
    inputCopy[index] = value;
    setInput(inputCopy);

    const stringLength = string.length - 1;

    if (index < stringLength) {
      refData[index + 1].current.focus();
    }
  };

  const setBackKey = (e, index) => {
    const keyCodeIs = e.keyCode;

    if (keyCodeIs === 8) {
      const copyString = [...input];
      copyString[index] = "";
      setInput(copyString);
      if (index > 0) {
        refData[index - 1].current.focus();
      }
    }
  };

  const pastOtp = (e) => {
    const paste = e.clipboardData.getData("text");
    const getCorrectPastData = paste.slice(0, 6).split("");
    setInput(getCorrectPastData);
    if (getCorrectPastData.length == input.length) {
      refData[5].current.focus();
    }
  };

  const sendOtp = async () => {
    const otp = input.join("");
    if (otp.length !== 6) {
      alert("Please enter a valid OTP");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("UserId not found. Please register again.");
      navigate("/register");
      return;
    }

    const result = await mutateAsync({ userId, otp });
    if (result?.ok) {
      alert(result?.message || "Otp verified successfully");
      if(fromPage === "forgot-password"){
        navigate("/forgot-password", { state: { from: "otp" } });
        return;
      }
      navigate("/");
      return;
    }
    alert(result?.message || "Otp is not correct");
  };

  const resendOtp = ()=>{
    const email = localStorage.getItem('email')
    const userId = localStorage.getItem("userId")
     if(userId &&email){
      resendOtpAsync({userId,email})
    }





  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-32 right-0 w-[36rem] h-[36rem] rounded-full bg-indigo-600/25 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-0 w-[32rem] h-[32rem] rounded-full bg-violet-600/20 blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10 overflow-hidden">
         <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">OTP Verification</h1>
            <p className="text-indigo-100 mt-2 text-sm">
              Enter the verification code sent to your device
            </p>
          </div>
        </div>

        <div className="p-8">
           <div className="mb-10">
            <label className="block text-slate-600 text-sm font-medium mb-4 text-center">
              6-Digit Verification Code
            </label>
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {input.map((item, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    ref={refData[index]}
                    maxLength={1}
                    value={input[index]}
                    onChange={(e) => getUserInput(e, index)}
                    onKeyDown={(e) => setBackKey(e, index)}
                    onPaste={(e) => pastOtp(e, index)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-3xl sm:text-4xl font-bold text-center text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={sendOtp}
              className="w-full cursor-pointer py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              Verify &amp; Continue
            </button>

            <div className="flex justify-center items-center">
              <button onClick={resendOtp} className="text-slate-500 hover:text-indigo-600 font-medium text-sm flex items-center gap-1.5 cursor-pointer transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Resend OTP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
