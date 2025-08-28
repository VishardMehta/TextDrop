import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ExternalLink } from 'lucide-react';
import { QRCodeGenerator } from './QRCodeGenerator';
import { FileUpload } from './FileUpload';

interface FileShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (file: File) => Promise<string>;
}

export const FileShareModal: React.FC<FileShareModalProps> = ({ isOpen, onClose, onShare }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const url = await onShare(selectedFile);
      setUploadProgress(100);
      setShareUrl(url);
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Error sharing file:', error);
      clearInterval(progressInterval);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadProgress(0);
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
    setSelectedFile(null);
    setShareUrl('');
    setShowQR(false);
    setCopied(false);
    setUploadProgress(0);
    setIsUploading(false);
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
            <h2 className="text-2xl font-bold text-white mb-6 retro-font text-center">Share Your Content</h2>
            <FileUpload
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onCancel={handleCancel}
              selectedFile={selectedFile}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 retro-font text-center">Content Shared!</h2>
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
              <div className="mt-6 flex justify-center">
                <QRCodeGenerator url={shareUrl} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};