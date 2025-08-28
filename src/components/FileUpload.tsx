import React, { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onCancel: () => void;
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUpload,
  onCancel,
  selectedFile,
  isUploading,
  uploadProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer hover:border-white/50 hover:bg-white/5 transition-all"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/70" />
          <p className="text-white retro-font text-sm mb-2">Click to select file</p>
          <p className="text-white/50 text-xs">Max size: 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-blue-300" />
              <div>
                <p className="text-white font-semibold text-sm break-all">{selectedFile.name}</p>
                <p className="text-white/70 text-xs">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isUploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white mb-2">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={onUpload}
            disabled={isUploading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 retro-font"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}
    </div>
  );
};