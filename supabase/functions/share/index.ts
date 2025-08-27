import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ShareRequest {
  text: string;
  content?: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

const generateShortKey = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { text }: ShareRequest = await req.json();
    const requestData: ShareRequest = await req.json();
    const { text, content, isFile = false, fileName, fileSize, contentType } = requestData;

    // Validate input based on whether it's a file or text
    if (isFile) {
      if (!content || !fileName) {
        return new Response(
          JSON.stringify({ error: 'File content and name are required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      if (!text || text.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Text is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    if (!text && !content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate unique short key
    let shortKey: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortKey = generateShortKey();
      const { data: existing } = await supabase
        .from('shared_texts')
        .select('short_key')
        .eq('short_key', shortKey)
        .single();
      
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate unique key' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store the text
    const insertData: any = {
      short_key: shortKey,
      content: isFile ? content : text?.trim(),
      is_file: isFile,
    };

    if (isFile) {
      insertData.file_name = fileName;
      insertData.file_size = fileSize;
      insertData.content_type = contentType;
    }

    const { error: insertError } = await supabase
      .from('shared_texts')
      .insert(insertData);

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save text' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const baseUrl = req.headers.get('origin') || 'https://your-domain.com';
    const shareUrl = `${baseUrl}/${shortKey}`;

    return new Response(
      JSON.stringify({
        shortKey,
        url: shareUrl,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in share function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});