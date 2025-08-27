import React, { useState } from 'react';
import { TextDisplay } from '../components/TextDisplay';
import { ShareModal } from '../components/ShareModal';
import { FileShareModal } from '../components/FileShareModal';
import { SearchBar } from '../components/SearchBar';
import { shareText } from '../services/api';
import { shareFile } from '../services/api';
import image from "../../public/a284f6be7a5f6e83360e2545e8d3c590.gif"; // Adjust the path as necessary
export const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (text: string): Promise<string> => {
    return await shareText(text);
  };

  const handleShareFile = async (file: File): Promise<string> => {
    return await shareFile(file);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background GIF */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-4">
          <SearchBar />
          <TextDisplay 
            text=""
            onOpenModal={() => setIsModalOpen(true)}
            onOpenFileModal={() => setIsFileModalOpen(true)}
            onCopy={handleCopy}
            copied={copied}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShare={handleShare}
      />

      {/* File Share Modal */}
      <FileShareModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onShare={handleShareFile}
      />
    </div>
  );
};