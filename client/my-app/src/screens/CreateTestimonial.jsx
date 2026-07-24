import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { testimonialSchema } from '../constant/YupSchema';
import { useCreateTestimonial } from "../hooks/hooks.js"
// import { mutateSync } from 'react-query'



const CreateTestimonial = () => {
  const {mutateAsync:createTestimonialAsync} = useCreateTestimonial()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(testimonialSchema),
    mode: 'onChange',

  });

  const onSubmit = async (data) => {

    console.log(data)

    await createTestimonialAsync(data)
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600 rounded-full filter blur-[120px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-600 rounded-full filter blur-[120px] opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-500 rounded-full filter blur-[120px] opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
         <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-emerald-200 font-medium text-sm tracking-wide">Share Your Story</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Share Your Experience
            </span>
          </h1>

          <p className="text-lg text-slate-300/80 max-w-2xl mx-auto">
            Help other travelers by sharing how AI Trip Planner helped create your perfect adventure
          </p>
        </div>

         <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_60%)]" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center ring-1 ring-white/25">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Write Your Testimonial</h2>
                <p className="text-indigo-100 text-sm mt-1">Your story inspires others</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
             <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold">
                Full Name
                <span className="text-indigo-500 text-sm">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="John & Sarah Doe"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-400'
                    }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

             <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold">
                Email Address
                <span className="text-indigo-500 text-sm">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="hello@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-400'
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>
 
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 font-semibold">
                Your Testimonial
                <span className="text-indigo-500 text-sm">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <textarea
                  {...register('message')}
                  rows="5"
                  placeholder="Share your experience with AI Trip Planner. How did we help make your trip special?"
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${errors.message ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:ring-indigo-400'
                    }`}
                />
              </div>
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.message.message}
                  </p>
                ) : ""}
              </div>
            </div>

            <button
              type="submit"
              // disabled={isSubmitting}
              className="w-full cursor-pointer py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Testimonial
            </button>

            <p className="text-xs text-center text-gray-400">
              Your testimonial will be reviewed before being published. We respect your privacy.
            </p>
          </form>
        </div>


      </div>
    </div>
  );
};

export default CreateTestimonial;;
