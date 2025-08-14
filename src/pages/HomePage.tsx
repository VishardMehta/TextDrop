import React, { useState } from 'react';
import { TextDisplay } from '../components/TextDisplay';
import { ShareModal } from '../components/ShareModal';
import { shareText } from '../services/api';

export const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (text: string): Promise<string> => {
    return await shareText(text);
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
          backgroundImage: 'url(/public/a284f6be7a5f6e83360e2545e8d3c590.gif)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <TextDisplay 
          text=""
          onOpenModal={() => setIsModalOpen(true)}
          onCopy={handleCopy}
          copied={copied}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShare={handleShare}
      />
    </div>
  );
};