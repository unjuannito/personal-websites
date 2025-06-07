import React from 'react';

const SearchSuggestions = ({ suggestions, onSelect, highlightedIndex }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="search-suggestions">
      <ul>
        {suggestions.map((suggestion, index) => (
          <li 
            key={index} 
            onClick={() => onSelect(suggestion)}
            className={highlightedIndex === index ? 'highlighted' : ''}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;