import React, { useEffect } from "react";
import {heroSectionData} from "../constant/Constant.js"
import { useLocation, useNavigate } from "react-router-dom";
import FeaturesSection from "./FeaturesImplementation.jsx";
import TestimonialsSection from "./Testimonials.jsx";
import HowItWorksSection from "./HowToWork.jsx";
import FAQSection from "./FaqSection.jsx";

function HeroSection() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
      if (!location.hash) return;
      const id = location.hash.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [location.hash]);

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>    

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-medium">AI-Based Trip Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
              Your Dream Trip,
            </span>
            <br />
            <span className="text-gray-800">Perfectly Planned by AI</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Share your vision, and our AI will analyze every detail to create a personalized trip plan 
            with destination recommendations, budget optimization, and itinerary management.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">AI Trip Analysis</h2>
                <p className="text-gray-600">Start your perfect trip planning journey</p>
              </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-4">
                <div className="h-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 flex items-center px-4">
                  <span className="text-gray-600">Your trip details will go here</span>
                </div>
                <div className="h-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 flex items-center px-4">
                  <span className="text-gray-600">AI will analyze and create perfect plan</span>
                </div>
              </div>

               <button
                className="w-full py-4 bg-gradient-to-r cursor-pointer from-blue-600 to-green-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                onClick={() => navigate('/ai-planning')}
              >
                <span    >Start AI Trip Analysis</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time AI Analysis</h3>
                  <p className="text-gray-600">Our AI analyzes thousands of data points to create your perfect plan</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Planned Trip</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-loading"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Optimal budget allocation</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-loading delay-200"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Creating timeline...</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 animate-loading delay-400"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Sample AI Response</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-4 rounded-xl border border-orange-100">
                  <h4 className="font-semibold text-orange-700 mb-2">🎯 Budget Breakdown</h4>
                  <p className="text-gray-700">AI suggests optimal budget allocation for your trip</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-700 mb-2">⭐ Top Destination Pick</h4>
                  <p className="text-gray-700">Perfect destination and hotel matches based on your preferences</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
                  <h4 className="font-semibold text-green-700 mb-2">📅 Timeline Suggestion</h4>
                  <p className="text-gray-700">Detailed trip planning timeline from start to finish</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {heroSectionData?.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-loading {
          animation: loading 2s ease-in-out infinite;
        }
      `}</style>
    </div>
    <FeaturesSection/>
    <HowItWorksSection/>
    <TestimonialsSection/>
    <FAQSection/>
    
    </div>
  );
}

export default HeroSection;



