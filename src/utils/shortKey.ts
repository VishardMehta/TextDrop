export const generateShortKey = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const extractShortKeyFromPath = (path: string): string | null => {
  const match = path.match(/^\/([a-zA-Z0-9]{4,6})$/);
  return match ? match[1] : null;
};