// components/TestimonialsSection.jsx
import React, { useEffect, useState } from 'react';
import { useGetTestimonials } from '../hooks/hooks.js';



const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {data} = useGetTestimonials()
  console.log(data)
  const testimonials = Array.isArray(data) ? data : []
  const safeIndex = testimonials.length ? activeIndex % testimonials.length : 0

  const nextTestimonial = () => {
    if (!testimonials.length) return
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  useEffect(()=>{
    if (testimonials.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  },[testimonials.length])

  const prevTestimonial = () => {
    if (!testimonials.length) return
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div id="testimonials" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
            Happy Travelers
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join thousands of travelers who planned their dream trip with AI
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {testimonials.length ? (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center text-4xl mb-4">
                TESTIMONIALS
              </div>
              <div className="flex gap-1 mb-4">
               
              </div>
              <p className="text-gray-700 text-lg italic mb-6">"{testimonials[safeIndex]?.message}"</p>
              <h4 className="text-xl font-bold text-gray-800">{testimonials[safeIndex]?.name}</h4>
              <p className="text-blue-600 text-sm">{testimonials[safeIndex]?.email}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center text-gray-600">
            No testimonials yet.
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={prevTestimonial}
            disabled={!testimonials.length}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 transition-all"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === safeIndex ? 'w-6 bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextTestimonial}
            disabled={!testimonials.length}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 transition-all"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
