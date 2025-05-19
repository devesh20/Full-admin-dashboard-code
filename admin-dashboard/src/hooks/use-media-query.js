import { useState, useEffect } from 'react';

/**
 * Hook that returns whether the window matches the given media query
 * @param {string} query - Media query to match
 * @returns {boolean} - Whether the window matches the given media query
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state with the match
    const updateMatch = () => {
      setMatches(media.matches);
    };

    // Set initial value
    updateMatch();
    
    // Add listener for subsequent updates
    media.addEventListener('change', updateMatch);
    
    // Clean up
    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
} 