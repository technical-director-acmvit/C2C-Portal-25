"use client";

import React, { useState } from 'react';
import DotGrid from './dot-grid';

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
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-6 px-4 text-left hover:bg-gray-800/20 transition-colors duration-200"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium text-white pr-4" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          <div 
            className={`w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center transition-transform duration-200 ${
              isOpen ? 'rotate-45 border-[#4ade80]' : ''
            }`}
          >
            <span className={`text-lg font-light ${isOpen ? 'text-[#4ade80]' : 'text-gray-400'}`}>
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
        <div className="px-4 pb-6">
          <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
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
      {/* DotGrid positioned behind the content - same as About and Sponsors */}
      <div className="absolute inset-0 z-0">
        <DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" />
      </div>
      
      {/* Content positioned above the dots */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl px-6 pointer-events-auto">
          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl border border-white/10 transform -translate-y-15">
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
