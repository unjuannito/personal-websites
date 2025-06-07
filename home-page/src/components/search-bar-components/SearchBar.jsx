import { useState, useRef, useEffect } from 'react';
import magnifyingGlass from '../../assets/magnifying-glass.svg';
import speechBubble from '../../assets/speech-bubble.svg';
import './SearchBar.css';
import isValidURL from '../../utils/isValidURL';
import SearchSuggestions from './SearchSuggestions';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Auto-focus al cargar el componente y cargar historial
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Cargar historial de búsquedas desde localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(history);
    
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchEngine, openInNewTab = false) => {
    let url;
    const trimmedSearch = search.trim();
    
    if (!trimmedSearch) {
      url = searchEngine === 'perplexity' 
        ? 'https://www.perplexity.ai' 
        : 'https://www.google.com';
    } else if (searchEngine === 'perplexity') {
      url = `https://www.perplexity.ai/search?q=${encodeURIComponent(trimmedSearch)}`;
    } else {
      const validUrl = isValidURL(trimmedSearch);
      url = validUrl || `https://www.google.com/search?q=${encodeURIComponent(trimmedSearch)}`;
    }
    
    // Guardar en historial si no es una URL y no está vacío
    if (trimmedSearch && !isValidURL(trimmedSearch)) {
      saveToHistory(trimmedSearch);
    }
    
    setShowSuggestions(false);
    
    if (openInNewTab) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };
  
  // Guardar búsqueda en el historial
  const saveToHistory = (query) => {
    // Evitar duplicados y mantener las búsquedas más recientes al principio
    const updatedHistory = [query, ...searchHistory.filter(item => item !== query)];
    
    // Limitar a 10 entradas para no sobrecargar localStorage
    const limitedHistory = updatedHistory.slice(0, 10);
    
    setSearchHistory(limitedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(limitedHistory));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isPerplexitySearch = e.altKey;
      const openInNewTab = e.ctrlKey || e.metaKey;
      
      // Si hay una sugerencia seleccionada, usarla
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        setSearch(suggestions[highlightedIndex]);
        handleSearch(isPerplexitySearch ? 'perplexity' : 'google', openInNewTab);
      } else {
        handleSearch(isPerplexitySearch ? 'perplexity' : 'google', openInNewTab);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  // Filtrar sugerencias basadas en la entrada del usuario
  const filterSuggestions = (input) => {
    if (!input.trim()) {
      return searchHistory.slice(0, 5); // Mostrar historial reciente si no hay entrada
    }
    
    const inputLower = input.toLowerCase();
    return searchHistory
      .filter(item => item.toLowerCase().includes(inputLower))
      .slice(0, 5); // Limitar a 5 sugerencias
  };

  const handleMiddleClick = (e, searchEngine) => {
    if (e.button === 1) {
      e.preventDefault();
      handleSearch(searchEngine, true);
    }
  };

  return (
    <div className="searchBar" style={{ position: 'relative' }}>
      <button 
        onClick={(e) => handleSearch('google', e.ctrlKey || e.metaKey)}
        onMouseDown={(e) => handleMiddleClick(e, 'google')}
        className="mr-2 hover:bg-gray-100 rounded-full p-1"
      >
        <img 
          src={magnifyingGlass}
          alt="Search" 
          className="w-5 h-5"
        />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSuggestions(filterSuggestions(e.target.value));
          setShowSuggestions(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => {
          setSuggestions(filterSuggestions(search));
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyPress}
        placeholder="Buscar o ingresar URL"
        className="flex-1 outline-none bg-transparent"
      />

      <button 
        onClick={(e) => handleSearch('perplexity', e.ctrlKey || e.metaKey)}
        onMouseDown={(e) => handleMiddleClick(e, 'perplexity')}
        className="ml-2 hover:bg-gray-100 rounded-full p-1"
      >
        <img
          src={speechBubble}
          alt="Perplexity Search"
          className="w-5 h-5"
        />
      </button>
      
      {showSuggestions && (
        <div ref={suggestionsRef}>
          <SearchSuggestions 
            suggestions={suggestions} 
            onSelect={(suggestion) => {
              setSearch(suggestion);
              setShowSuggestions(false);
              inputRef.current.focus();
            }}
            highlightedIndex={highlightedIndex}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;