import React from 'react';
import { Share2, Copy, Check, Home, Upload } from 'lucide-react';

interface TextDisplayProps {
  text: string;
  onOpenModal: () => void;
  onOpenFileModal?: () => void;
  onCopy?: () => void;
  onNewText?: () => void;
  copied?: boolean;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ 
  text, 
  onOpenModal, 
  onOpenFileModal,
  onCopy, 
  onNewText, 
  copied = false 
}) => {
  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 ${
      text ? 'max-w-4xl w-full mx-4 p-6' : 'max-w-2xl w-full mx-4 p-8 hover:bg-white/15 hover:scale-105 hover:shadow-2xl cursor-pointer'
    }`}>
      {text ? (
        <div className="text-white">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold retro-font text-blue-300">Shared Text</h2>
          </div>
          
          {/* Text Content Container */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="text-base leading-relaxed whitespace-pre-wrap break-words font-mono text-gray-100 selection:bg-blue-500/30">
              {text}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCopy}
              className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl 
                hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed 
                transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 min-w-[140px] justify-center"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={onNewText}
              className="py-3 px-6 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 
                transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 min-w-[140px] justify-center"
            >
              <Home className="w-4 h-4" />
              Share New Text
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="text-center text-white flex flex-col items-center justify-center"
        >
          <Share2 className="w-16 h-16 mx-auto mb-6 opacity-70" />
          <h1 className="text-3xl font-bold mb-4 retro-font">Share Your Content!</h1>
          <p className="text-sm opacity-70 retro-font">
            Generate unique URLs for your text and file content
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={onOpenModal}
              className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 justify-center"
            >
              <Share2 className="w-4 h-4" />
              Share Text
            </button>
            {onOpenFileModal && (
              <button
                onClick={onOpenFileModal}
                className="py-3 px-6 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 justify-center"
              >
                <Upload className="w-4 h-4" />
                Share File
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};