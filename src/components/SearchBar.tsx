import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const key = searchKey.trim();
    if (key && key.length >= 4 && key.length <= 6) {
      navigate(`/${key}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
          placeholder="Enter 6-digit code..."
          className="w-full py-3 px-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all retro-font text-center"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={!searchKey.trim() || searchKey.length < 4}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};