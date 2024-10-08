"use client"
import { Bot } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full bg-[#1a1a1a] text-green-500 space-y-6">
      {/* Robot Icon */}
      <Bot className="w-24 h-24 animate-bounce" />
      
      {/* Loading Text */}
      <p className="text-lg font-semibold">Your project is being created...</p>

      {/* Animated Loading Balls */}
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-75"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce delay-225"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
