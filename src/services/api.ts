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
    throw new Error('Failed to share text');
  }

  const data: ShareResponse = await response.json();
  return data.url;
};

export const getText = async (shortKey: string): Promise<string> => {
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
  return data.text;
};