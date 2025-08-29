const botRegex = /(Googlebot|bingbot|DuckDuckBot|Baiduspider|YandexBot|Slurp|Sogou|facebot|ia_archiver|Twitterbot|Discordbot|linkedinbot|SemrushBot|AhrefsBot)/i;

export const logBotVisit = () => {
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    if (botRegex.test(userAgent)) {
      console.log("BOT_CLIENT", { 
        ua: userAgent, 
        url: window.location.href,
        t: new Date().toISOString() 
      });
    }
  }
};

export const isBotUserAgent = (userAgent: string): boolean => {
  return botRegex.test(userAgent);
};