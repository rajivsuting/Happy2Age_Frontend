import React, { useState } from "react";
import {
  FiBarChart2,
  FiMessageSquare,
  FiTrendingUp,
  FiUsers,
  FiHeart,
  FiMap,
  FiClock,
  FiCheckCircle,
  FiStar,
  FiMessageCircle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const domainNames = [
  "Perception of Self",
  "Motor Skills",
  "Attention",
  "Cognition",
  "Verbalisation",
  "Creativity",
  "Group Interaction",
];

const AutomatedDataAnalysis = () => {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const flashcards = [
    {
      title: "Cognition Improvement",
      description:
        "Improvement by 23% within 6 months on the Cognition parameters across all centres",
      icon: "🧠",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Group Interaction Growth",
      description:
        "Improvement by 18% within 4 months on the Group Interaction parameters across all centres",
      icon: "👥",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Creativity Enhancement",
      description:
        "Improvement by 31% within 8 months on the Creativity parameters across all centres",
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Attention Focus",
      description:
        "Improvement by 15% within 3 months on the Attention parameters across all centres",
      icon: "🎯",
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Motor Skills Development",
      description:
        "Improvement by 27% within 5 months on the Motor Skills parameters across all centres",
      icon: "🤲",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Verbalisation Progress",
      description:
        "Improvement by 20% within 7 months on the Verbalisation parameters across all centres",
      icon: "💬",
      color: "from-teal-500 to-blue-500",
    },
    {
      title: "Self-Perception Boost",
      description:
        "Improvement by 25% within 6 months on the Perception of Self parameters across all centres",
      icon: "🌟",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Member Success Stories",
      description:
        "So many members have improved on multiple cognitive domains with consistent engagement",
      icon: "🏆",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const testimonials = [
    {
      name: "Anonymous Member",
      role: "Happy2Age Participant",
      center: "Member",
      content:
        "I was lonely because my mum passed away. Expected to see and make friends with people my age. Also look forward to learning new activities",
      rating: 5,
      avatar: "👵",
    },
    {
      name: "Anonymous Daughter",
      role: "Family Member",
      center: "Daughter of a participant",
      content:
        "My mother's enthusiasm has improved. More importantly, she's happy",
      rating: 5,
      avatar: "👩‍👧",
    },
    {
      name: "Anonymous Member",
      role: "Happy2Age Participant",
      center: "Member",
      content:
        "To activate my brain with some interactive brain games and opening up with other my age ladies",
      rating: 5,
      avatar: "👵",
    },
    {
      name: "Anonymous Member",
      role: "Happy2Age Participant",
      center: "Member",
      content:
        "I like that we all have fun as one big family. The 1 and an hour passes so fast, you all conduct the classes very well",
      rating: 5,
      avatar: "👵",
    },
  ];

  const nextFlashcard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
  };

  const prevFlashcard = () => {
    setCurrentFlashcard(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 w-full">
      {/* Coming Soon Badge */}
      <div className="absolute top-6 right-6 z-10">
        <span className="bg-yellow-400 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-lg">
          Coming Soon
        </span>
      </div>

      {/* Hero Section */}
      <div className="w-full text-center mb-10 px-8 md:px-12">
        <h1 className="text-5xl font-extrabold text-[#239d62] mb-3">
          Automated Data Analysis & Reporting
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Harness AI and NLP to make complex data accessible, track progress
          over years, and integrate with leading partners for holistic senior
          care.
        </p>
      </div>

      {/* Interactive Flashcards Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10">
        <h2 className="text-3xl font-semibold text-[#239d62] mb-8 text-center">
          Key Features at a Glance
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            {/* Flashcard */}
            <div
              className={`bg-gradient-to-r ${flashcards[currentFlashcard].color} text-white rounded-2xl p-8 shadow-xl transform transition-all duration-500 hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {flashcards[currentFlashcard].icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  {flashcards[currentFlashcard].title}
                </h3>
                <p className="text-lg opacity-90">
                  {flashcards[currentFlashcard].description}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevFlashcard}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
            >
              <FiArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextFlashcard}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
            >
              <FiArrowRight className="h-6 w-6" />
            </button>
          </div>

          {/* Flashcard Indicators */}
          <div className="flex space-x-2 mt-6">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFlashcard(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentFlashcard
                    ? "bg-[#239d62] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Flashcard Counter */}
          <p className="text-gray-600 mt-3 text-sm">
            {currentFlashcard + 1} of {flashcards.length}
          </p>
        </div>
      </div>

      {/* NLP Summaries Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0 flex flex-col items-center">
          <FiMessageSquare className="h-12 w-12 text-[#239d62] mb-2" />
          <h2 className="text-2xl font-semibold text-[#239d62] mb-2">
            NLP-Powered Summaries
          </h2>
          <p className="text-gray-600 text-center mb-2">
            AI-generated, easy-to-understand summaries of complex reports.
          </p>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm w-full">
          <div className="text-gray-500 text-sm mb-2">Sample Summary:</div>
          <div className="text-base text-gray-800 italic">
            "In the last quarter, <b>Cognition</b> and <b>Creativity</b> domains
            showed the highest improvement, with average scores rising by 18%
            and 15% respectively. <b>Group Interaction</b> and{" "}
            <b>Perception of Self</b> also saw steady growth. Attendance
            remained high, and satisfaction scores increased across all
            centres."
          </div>
        </div>
      </div>

      {/* Longitudinal Studies Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10">
        <div className="text-center mb-8">
          <FiTrendingUp className="h-16 w-16 text-[#239d62] mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-[#239d62] mb-4">
            Longitudinal Progress Tracking
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Monitor cognitive improvements and track member progress across
            multiple domains over months and years. Our advanced analytics
            provide insights for research and evidence-based care improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart Visualization */}
          <div className="bg-gradient-to-br from-[#239d62]/5 to-[#10b981]/5 rounded-xl p-6 border border-[#239d62]/20">
            <h3 className="text-xl font-semibold text-[#239d62] mb-4 text-center">
              Sample Progress Timeline
            </h3>
            <div className="space-y-4">
              {domainNames.map((domain, index) => (
                <div key={domain} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#239d62]"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {domain}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#239d62] to-[#10b981] h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(85, 60 + index * 15)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#239d62] w-12 text-right">
                    {Math.min(85, 60 + index * 15)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Each domain shows progress over time with visual indicators and
              percentage scores
            </div>
          </div>

          {/* Benefits and Features */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-[#239d62] mr-2">📊</span>
                Data Collection
              </h4>
              <p className="text-sm text-gray-600">
                Automated collection of cognitive assessments, activity
                participation, and wellness metrics
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-[#239d62] mr-2">📈</span>
                Trend Analysis
              </h4>
              <p className="text-sm text-gray-600">
                Identify patterns, improvements, and areas needing attention
                over extended periods
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-[#239d62] mr-2">🔬</span>
                Research Support
              </h4>
              <p className="text-sm text-gray-600">
                Generate reports for academic research and evidence-based care
                improvement
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="text-[#239d62] mr-2">🎯</span>
                Personalized Insights
              </h4>
              <p className="text-sm text-gray-600">
                Tailored recommendations based on individual progress patterns
                and trends
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration with Partners Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10">
        <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
          Integration with Leading Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <FiHeart className="h-10 w-10 text-[#239d62] mb-2" />
            <div className="font-semibold text-gray-800 mb-1">Healthcare</div>
            <div className="text-gray-500 text-sm text-center mb-2">
              Connect with healthcare providers for holistic well-being.
            </div>
            <div className="text-xs text-gray-600 text-center">
              <b>Example:</b> Book telemedicine appointments, share health
              reports with your doctor, or receive medication reminders directly
              from the Happy2Age platform.
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <FiClock className="h-10 w-10 text-[#239d62] mb-2" />
            <div className="font-semibold text-gray-800 mb-1">
              Dementia Assessment
            </div>
            <div className="text-gray-500 text-sm text-center mb-2">
              Integrate dementia screening and management tools.
            </div>
            <div className="text-xs text-gray-600 text-center">
              <b>Example:</b> Take a digital cognitive assessment, track changes
              over time, and connect with dementia care specialists for
              personalized support.
            </div>
          </div>
          <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
            <FiMap className="h-10 w-10 text-[#239d62] mb-2" />
            <div className="font-semibold text-gray-800 mb-1">
              Travel & Lifestyle
            </div>
            <div className="text-gray-500 text-sm text-center mb-2">
              Offer travel and lifestyle services for seniors.
            </div>
            <div className="text-xs text-gray-600 text-center">
              <b>Example:</b> Browse curated travel packages for seniors, book
              group trips, or access local events and wellness activities
              through trusted partners.
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-10">
        <h2 className="text-3xl font-semibold text-[#239d62] mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-4xl">
            {/* Testimonial Card */}
            <div className="bg-gradient-to-r from-[#239d62]/5 to-[#10b981]/5 border border-[#239d62]/20 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <FiStar
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>
                <FiMessageCircle className="h-8 w-8 text-[#239d62] mx-auto mb-3" />
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </p>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-[#239d62] font-medium">
                  {testimonials[currentTestimonial].role}
                </p>
                <p className="text-gray-600 text-sm">
                  {testimonials[currentTestimonial].center}
                </p>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-[#239d62] rounded-full p-3 shadow-lg transition-all duration-200 border border-gray-200"
            >
              <FiArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-[#239d62] rounded-full p-3 shadow-lg transition-all duration-200 border border-gray-200"
            >
              <FiArrowRight className="h-6 w-6" />
            </button>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial
                    ? "bg-[#239d62] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Testimonial Counter */}
          <p className="text-gray-600 mt-3 text-sm">
            {currentTestimonial + 1} of {testimonials.length}
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full bg-white rounded-lg shadow p-8 md:p-12 mb-16">
        <h2 className="text-2xl font-semibold text-[#239d62] mb-6 text-center">
          Benefits for Users
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700 list-disc list-inside">
          <li>Easy-to-understand, actionable reports</li>
          <li>
            Track progress in domains like Cognition, Creativity, Group
            Interaction, and more
          </li>
          <li>Support for research and evidence-based care</li>
          <li>Access to integrated health and lifestyle services</li>
          <li>Personalized insights for every member</li>
          <li>Empowers families, caregivers, and professionals</li>
        </ul>
      </div>
    </div>
  );
};

export default AutomatedDataAnalysis;
