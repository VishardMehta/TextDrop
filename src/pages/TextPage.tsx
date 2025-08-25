import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextDisplay } from '../components/TextDisplay';
import { ShareModal } from '../components/ShareModal';
import { getText, shareText } from '../services/api';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import image from "../../public/a284f6be7a5f6e83360e2545e8d3c590.gif";

export const TextPage: React.FC = () => {
  const { shortKey } = useParams<{ shortKey: string }>();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      if (!shortKey) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      try {
        const fetchedText = await getText(shortKey);
        setText(fetchedText);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load text');
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [shortKey]);

  const handleShare = async (newText: string): Promise<string> => {
    return await shareText(newText);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNewText = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
              <p className="text-lg retro-font">Loading text...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/public/a284f6be7a5f6e83360e2545e8d3c590.gif)',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="text-center text-white">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold mb-2 retro-font">Text Not Found</h2>
              <p className="text-lg opacity-90 mb-6">{error}</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 py-2 px-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all retro-font"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background GIF */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/public/a284f6be7a5f6e83360e2545e8d3c590.gif)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation */}
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <TextDisplay 
          text={text}
          onOpenModal={() => setIsModalOpen(true)}
          onCopy={handleCopy}
          onNewText={handleNewText}
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