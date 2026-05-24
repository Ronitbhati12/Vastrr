import React from 'react';

export default function AnimatedMenuIcon({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-10 cursor-pointer flex flex-col items-center justify-center space-y-1.5 focus:outline-none md:hidden overflow-hidden"
      aria-label="Toggle menu"
    >
      <div
        className={`h-1.5 bg-purple-400 rounded-lg transition-all duration-300 origin-right ${
          isOpen ? 'w-full rotate-[-30deg] -translate-y-[5px]' : 'w-2/3'
        }`}
      ></div>
      <div
        className={`w-full h-1.5 bg-purple-400 rounded-lg transition-all duration-300 origin-center ${
          isOpen ? 'rotate-90 translate-x-4 opacity-0' : ''
        }`}
      ></div>
      <div
        className={`h-1.5 bg-purple-400 rounded-lg transition-all duration-300 origin-right ${
          isOpen ? 'w-full rotate-[30deg] translate-y-[5px]' : 'w-2/3'
        }`}
      ></div>
    </button>
  );
}
