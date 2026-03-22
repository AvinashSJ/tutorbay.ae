import React from "react";

const Hero2 = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      {/* Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-100 rounded-full opacity-30"></div>
        <div className="absolute left-1/4 bottom-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>
        <div className="absolute right-1/4 top-1/2 w-24 h-24 bg-purple-200 opacity-30"></div>
        <div className="absolute left-1/2 top-1/3 w-16 h-16 bg-blue-100 opacity-50"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn From Expert Tutors.
              <br />
              <span className="text-blue-600">Face-To-Face Or Online.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              We Can Help You Find Matching Local And Online Tutors In Seconds. 
              Hire A Tutor Now - For FREE.
            </p>
            
            {/* Email Signup Form */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Content - Abstract Graphics */}
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl relative overflow-hidden">
              <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-60"></div>
              <div className="absolute bottom-20 left-10 w-16 h-16 bg-pink-300 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>
              <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-purple-300 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
