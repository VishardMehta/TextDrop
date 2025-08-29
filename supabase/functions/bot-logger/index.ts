const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, user-agent',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const botRegex = /(Googlebot|bingbot|DuckDuckBot|Baiduspider|YandexBot|Slurp|Sogou|facebot|ia_archiver|Twitterbot|Discordbot|linkedinbot|SemrushBot|AhrefsBot)/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userAgent = req.headers.get('user-agent') || '';
    const url = new URL(req.url);
    
    if (botRegex.test(userAgent)) {
      console.log("BOT_HIT_SERVER", {
        ua: userAgent,
        url: req.url,
        referer: req.headers.get('referer'),
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        t: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify({ logged: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in bot-logger function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});