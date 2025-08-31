"use client";

import React, { useState } from 'react';
import DotGrid from './dot-grid';
import Topper from './topper';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is C2C?",
    answer: "C2C is a comprehensive platform designed to connect students, professionals, and organizations in the tech community. We provide resources, networking opportunities, and career development support."
  },
  {
    question: "How do I apply?",
    answer: "You can apply by clicking the 'Apply Now' button and filling out our application form. Make sure to provide all required information and any relevant portfolio or project links."
  },
  {
    question: "What are the eligibility criteria?",
    answer: "We welcome applications from students, recent graduates, and early-career professionals in technology fields. No specific degree requirements, but passion for tech and willingness to learn are essential."
  },
  {
    question: "Is there an application fee?",
    answer: "No, our application process is completely free. We believe in making opportunities accessible to everyone regardless of their financial situation."
  },
  {
    question: "When is the application deadline?",
    answer: "Application deadlines vary by program. Please check our website regularly for updated timelines, or reach out to our team for specific program deadlines."
  }
];

const FAQItem: React.FC<{ faq: FAQItem; isOpen: boolean; onToggle: () => void }> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className={`mb-4 bg-black/20 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
      isOpen 
        ? 'border-white/70 shadow-xl shadow-white/40 ring-2 ring-white/20' 
        : 'border-white/30 shadow-lg shadow-white/20 hover:border-white/50 hover:shadow-white/30'
    }`}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-200"
      >
        <h3 className="text-lg font-medium text-white pr-4" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          <div 
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isOpen ? 'rotate-45 border-teal-400 shadow-sm shadow-teal-400/50' : 'border-gray-400'
            }`}
          >
            <span className={`text-lg font-light ${isOpen ? 'text-teal-400' : 'text-gray-400'}`}>
              +
            </span>
          </div>
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 border-t border-teal-400/20">
          <p className="text-gray-300 leading-relaxed pt-4" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faqs" className="w-full min-h-screen relative overflow-hidden">
      <Topper text="FAQs" />
      {/* DotGrid positioned behind the content - same as About and Sponsors */}
      <div className="absolute inset-0 z-0">
        <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
      </div>
      
      {/* Content positioned above the dots */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-6 pointer-events-auto">
          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            <div className="p-6">
              {faqData.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
