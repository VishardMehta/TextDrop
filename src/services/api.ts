const API_BASE = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : '/api';

export interface ShareResponse {
  shortKey: string;
  url: string;
}

export interface TextResponse {
  text: string;
  createdAt: string;
  isFile: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export interface ContentData {
  content: string;
  isFile: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export const shareText = async (text: string): Promise<string> => {
  const response = await fetch(`${API_BASE}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_SUPABASE_ANON_KEY && {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      })
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to share text');
  }

  const data: ShareResponse = await response.json();
  return data.url;
};

export const shareFile = async (file: File): Promise<string> => {
  // Convert file to base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64 data
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${API_BASE}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.VITE_SUPABASE_ANON_KEY && {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      })
    },
    body: JSON.stringify({
      content: base64,
      isFile: true,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to share file');
  }

  const data: ShareResponse = await response.json();
  return data.url;
};

export const getContent = async (shortKey: string): Promise<ContentData> => {
  const response = await fetch(`${API_BASE}/text/${shortKey}`, {
    headers: {
      ...(import.meta.env.VITE_SUPABASE_ANON_KEY && {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      })
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Text not found');
    }
    throw new Error('Failed to retrieve text');
  }

  const data: TextResponse = await response.json();
  return {
    content: data.text,
    isFile: data.isFile,
    fileName: data.fileName,
    fileSize: data.fileSize,
    contentType: data.contentType
  };
};

// Keep backward compatibility
export const getText = async (shortKey: string): Promise<string> => {
  const data = await getContent(shortKey);
  return data.content;
};