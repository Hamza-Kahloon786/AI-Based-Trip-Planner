// components/HowItWorksSection.jsx
import React from 'react';
import {howToWork} from "../constant/Constant"

const HowItWorksSection = () => {
 

  return (
    <div id="how-it-works" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-full border border-blue-200">
          <span className="text-blue-700 font-medium text-sm">Simple Process</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Four simple steps to your dream trip
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {howToWork.map((step, index) => (
          <div key={index} className="relative text-center">
            {index < howToWork.length - 1 && (
              <div className="hidden lg:block absolute top-1/3 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-green-200 transform -translate-y-1/2">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{step.number}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksSection;
