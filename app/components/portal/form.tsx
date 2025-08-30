"use client";

import React, { useState } from "react";
import Image from 'next/image';

const Form = () => {
  const [formData, setFormData] = useState({
    track: '',
    ideaTitle: '',
    description: '',
    techStack: '',
    figmaLink: '',
    driveLink: '',
    githubLink: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (typeof window !== 'undefined') {
      console.log("Form submitted:", formData);
      // Add form submission logic here
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
      {/* Logo top left */}
      <div className="absolute top-6 left-18">
        <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
      </div>
      
      {/* Centered form */}
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-gray-600">
          <h1 
            className="text-white mb-8 text-center"
            style={{
              fontSize: '32px',
              fontFamily: "'Pilat Extended', Arial, sans-serif",
              fontWeight: '700'
            }}
          >
            Form
          </h1>
          
          <div className="space-y-4">
            {/* Track Dropdown */}
            <div>
              <select
                name="track"
                value={formData.track}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              >
                <option value="" className="text-gray-400">Track</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="ai">AI/ML</option>
                <option value="blockchain">Blockchain</option>
              </select>
            </div>

            {/* Idea Title */}
            <div>
              <input
                type="text"
                name="ideaTitle"
                value={formData.ideaTitle}
                onChange={handleInputChange}
                placeholder="Idea Title"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Description */}
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows={4}
                maxLength={100}
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94] resize-none"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
              <div className="absolute bottom-2 right-2 text-gray-400 text-xs">
                {formData.description.length}/100 words
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="Tech Stack"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Figma Link */}
            <div>
              <input
                type="url"
                name="figmaLink"
                value={formData.figmaLink}
                onChange={handleInputChange}
                placeholder="Figma Link"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Drive Link */}
            <div>
              <input
                type="url"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleInputChange}
                placeholder="Drive Link"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Github Link */}
            <div>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="Github Link"
                className="w-full p-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#5EBF94]"
                style={{
                  fontFamily: "'Pilat Extended', Arial, sans-serif",
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button 
              className="px-12 py-3 rounded-lg text-white cursor-pointer transition-all duration-200 hover:bg-[#4da577] active:scale-95" 
              style={{ 
                backgroundColor: '#5EBF94',
                fontSize: '18px',
                fontFamily: "'Pilat Extended', Arial, sans-serif",
                fontWeight: '400'
              }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
