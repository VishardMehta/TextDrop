import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { QRCodeGenerator } from './QRCodeGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (text: string) => Promise<string>;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare }) => {
  const [text, setText] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleShare = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const url = await onShare(text);
      setShareUrl(url);
    } catch (error) {
      console.error('Error sharing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClose = () => {
    setText('');
    setShareUrl('');
    setShowQR(false);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full mx-4 transform transition-all duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!shareUrl ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 retro-font text-center">Share Your Text</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-40 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              autoFocus
            />
            <button
              onClick={handleShare}
              disabled={!text.trim() || isLoading}
              className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 retro-font"
            >
              {isLoading ? 'Generating Link...' : 'Generate Link'}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 retro-font text-center">Link Generated!</h2>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-center">
                <span className="text-white font-mono text-sm break-all mr-2">
                  {shareUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-2 text-white/70 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowQR(!showQR)}
                className="py-2 px-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 retro-font"
              >
                <QrCode className="w-4 h-4" />
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
              <button
                onClick={() => window.open(shareUrl, '_blank')}
                className="py-2 px-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2 retro-font"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </button>
            </div>

            {showQR && (
              <div className="mt-6 flex justify-center items-center">
                <QRCodeGenerator url={shareUrl} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};