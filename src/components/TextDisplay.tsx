import React from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface TextDisplayProps {
  text: string;
  onOpenModal: () => void;
  onCopy?: () => void;
  onNewText?: () => void;
  copied?: boolean;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ 
  text, 
  onOpenModal, 
  onCopy, 
  onNewText, 
  copied = false 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4 transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-2xl">
      { text ? (
  <div className="text-white flex flex-col items-center justify-center text-center">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold retro-font">Shared Text</h2>
    </div>
    <p className="text-lg leading-relaxed whitespace-pre-wrap break-words">
      {text}
    </p>
    <div className="flex flex-col items-center gap-4 mt-6">
      <button
        onClick={onCopy}
        className="mx-auto py-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl 
hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
      <button
        onClick={onNewText}
        className="py-2 px-6 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all retro-font"
      >
        Share New Text
      </button>
    </div>
  </div>
) : (
        <div 
          className="text-center text-white cursor-pointer"
          onClick={onOpenModal}
        >
          <Share2 className="w-16 h-16 mx-auto mb-6 opacity-70" />
          <h1 className="text-3xl font-bold mb-4 retro-font">Share Your Text !</h1>
          <p className="text-sm opacity-70 retro-font">
            Generate unique URLs for your text content
          </p>
        </div>
      )}
    </div>
  );
};