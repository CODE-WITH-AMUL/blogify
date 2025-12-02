import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ searchQuery, setSearchQuery, onSubmit }) {
  return (
    <div className="search-container">
      <form onSubmit={onSubmit} className="search-form">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search articles, tutorials, guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchBar;