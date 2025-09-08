"use client";

import React, { useState } from "react";
import DotGrid from "./dot-grid";
import GradientBG from "./gradient-bg";
import HeadingText from "./HeadingText";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Who all can register?",
    answer:
      "Students from all over the country are eligible to participate in Code2Create. Everybody is welcome to make a difference.",
  },
  {
    question: "What will the hackathon cost me?",
    answer: "Nothing, it's absolutely free. You cannot put a price on groundbreaking ideas.",
  },
  {
    question: "Can I implement my idea in hardware?",
    answer:
      "Sure! There's no bias between sofware and hardware. But you'll have to bring your own hardware.",
  },
  {
    question: "What kind of a hackathon is Code2Create?",
    answer: "Code2Create is a tech-based hackathon.",
  },
  {
    question: "How many members can constitute a team?",
    answer: "There should be a minimum of 3 members and can be up to 5 members in a team. Each member of the team needs to register individually on the Gravitas portal",
  },
  {
    question: "Will there be accommodation for external participants?",
    answer: "Yes we will provide accomodation at VIT.",
  },
  { question: "How do I choose my track?", answer: "You will get the option while registering." },
  {
    question: "Can I start working on my hack before the hackathon?",
    answer:
      "No, you are not permitted to work on pre-existing projects in the hackathon. To maintain fair standards of judgment you will begin working on your hack after reporting to the venue.",
  },
  {
    question: "Is the hackathon only about technology?",
    answer:
      "We are tech enthusiasts but we believe 'All work and no play makes Jack a dull boy.' We have numerous fun activities planned for you.",
  },
  {
    question: "What will be the judging criteria?",
    answer: "Innovation & Creativity, Problem Relevance, Technical Complexity, Implementation & Functionality, User Experience (UI/UX), Scalability & Future Scope, Presentation & Communication, Novelty",
  },
  {
    question: "How will I benefit from attending this hackathon?",
    answer:
      "Code2Create is a place for innovators to create and make a difference. You will get an opportunity to interact with ingenious minds. In addition, we have cash prizes, licenses, schwags, cloud credits and goodies for the winner.",
  },
  {
    question: "Will there be travel reimbursements provided?",
    answer: "Travel reimbursement is not provided for external participants.",
  },
];

const FAQItem: React.FC<{ faq: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  faq,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={`mb-4 bg-black/20 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-white/70 shadow-xl shadow-white/40 ring-2 ring-white/20"
          : "border-white/30 shadow-lg shadow-white/20 hover:border-white/50 hover:shadow-white/30"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-200 min-h-[60px] touch-manipulation"
      >
        <h3
          className="text-base sm:text-lg font-medium text-white pr-3 sm:pr-4 leading-tight"
          style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
        >
          {faq.question}
        </h3>
        <div className="flex-shrink-0 ml-2">
          <div
            className={`w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              isOpen ? "rotate-45 border-teal-400 shadow-sm shadow-teal-400/50" : "border-gray-400"
            }`}
          >
            <span
              className={`text-xl sm:text-lg font-light ${isOpen ? "text-teal-400" : "text-gray-400"}`}
            >
              +
            </span>
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-teal-400/20">
          <p
            className="text-gray-300 leading-relaxed pt-3 sm:pt-4 text-sm sm:text-base"
            style={{ fontFamily: "DM Sans, Arial, sans-serif" }}
          >
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
  const mid = Math.ceil(faqData.length / 2);
  const leftFAQs = faqData.slice(0, mid);
  const rightFAQs = faqData.slice(mid);

  return (
    <GradientBG>
      <div className="w-full min-h-screen relative overflow-hidden">
        {/* Dots in the background */}
        <div className="absolute inset-0 z-0">
          <DotGrid dotSize={2.5} gap={25} baseColor="#a3a3a3" />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
          {/* Heading */}
          <HeadingText text="FAQs" />

          {/* FAQ Items */}
          <div className="mt-10 sm:mt-14 lg:mt-20 w-full max-w-5xl lg:max-w-6xl pb-8 sm:pb-12 lg:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Left column */}
              <div className="space-y-3 sm:space-y-4">
                {leftFAQs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    isOpen={openIndex === index}
                    onToggle={() => toggleFAQ(index)}
                  />
                ))}
              </div>

              {/* Right column */}
              <div className="space-y-3 sm:space-y-4">
                {rightFAQs.map((faq, idx) => {
                  const globalIndex = mid + idx;
                  return (
                    <FAQItem
                      key={globalIndex}
                      faq={faq}
                      isOpen={openIndex === globalIndex}
                      onToggle={() => toggleFAQ(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientBG>
  );
};

export default FAQs;
