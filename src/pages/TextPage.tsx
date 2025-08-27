import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextDisplay } from '../components/TextDisplay';
import { ShareModal } from '../components/ShareModal';
import { FileShareModal } from '../components/FileShareModal';
import { getContent, shareText, shareFile } from '../services/api';
import { ArrowLeft, AlertCircle, Download } from 'lucide-react';
import image from "../../public/a284f6be7a5f6e83360e2545e8d3c590.gif";

interface ContentData {
  content: string;
  isFile: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export const TextPage: React.FC = () => {
  const { shortKey } = useParams<{ shortKey: string }>();
  const navigate = useNavigate();
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      if (!shortKey) {
        setError('Invalid URL');
        setLoading(false);
        return;
      }

      try {
        const data = await getContent(shortKey);
        setContentData(data);
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

  const handleShareFile = async (file: File): Promise<string> => {
    return await shareFile(file);
  };

  const handleCopy = async () => {
    try {
      if (contentData && !contentData.isFile) {
        await navigator.clipboard.writeText(contentData.content);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNewText = () => {
    navigate('/');
  };

  const handleDownload = () => {
    if (!contentData || !contentData.isFile) return;

    try {
      // Convert base64 back to blob
      const byteCharacters = atob(contentData.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentData.contentType });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contentData.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            backgroundImage:`url(${image})`,
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
          backgroundImage:`url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation */}
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-8">
        {contentData?.isFile ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-2xl w-full mx-4 p-8">
            <div className="text-center text-white">
              <Download className="w-16 h-16 mx-auto mb-6 text-blue-300" />
              <h2 className="text-2xl font-bold mb-4 retro-font">Shared Content</h2>
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-6">
                <p className="text-lg font-semibold mb-2 break-all">{contentData.fileName}</p>
                <p className="text-white/70 text-sm">
                  {contentData.fileSize && formatFileSize(contentData.fileSize)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 min-w-[140px] justify-center"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </button>
                <button
                  onClick={handleNewText}
                  className="py-3 px-6 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 retro-font flex items-center gap-2 min-w-[140px] justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Share New Content
                </button>
              </div>
            </div>
          </div>
        ) : (
          <TextDisplay 
            text={contentData?.content || ''}
            onOpenModal={() => setIsModalOpen(true)}
            onOpenFileModal={() => setIsFileModalOpen(true)}
            onCopy={handleCopy}
            onNewText={handleNewText}
            copied={copied}
          />
        )}
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