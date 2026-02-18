// User preferences and history management using localStorage

export interface RecentSearch {
  slug: string;
  name: string;
  timestamp: number;
  type: 'drug' | 'comparison';
}

export interface FavoriteDrug {
  slug: string;
  name: string;
  addedAt: number;
}

// Get recent searches (last 5)
export function getRecentSearches(): RecentSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('recentSearches');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add a search to recent history
export function addRecentSearch(slug: string, name: string, type: 'drug' | 'comparison' = 'drug') {
  if (typeof window === 'undefined') return;
  try {
    const searches = getRecentSearches();
    
    // Remove duplicate if exists
    const filtered = searches.filter(s => s.slug !== slug);
    
    // Add new search at the beginning
    const newSearch: RecentSearch = {
      slug,
      name,
      timestamp: Date.now(),
      type
    };
    
    // Keep only last 5
    const updated = [newSearch, ...filtered].slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

// Clear recent searches
export function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('recentSearches');
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

// Get favorite drugs
export function getFavoriteDrugs(): FavoriteDrug[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('favoriteDrugs');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Check if a drug is favorited
export function isFavorite(slug: string): boolean {
  const favorites = getFavoriteDrugs();
  return favorites.some(f => f.slug === slug);
}

// Toggle favorite status
export function toggleFavorite(slug: string, name: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavoriteDrugs();
    const exists = favorites.some(f => f.slug === slug);
    
    if (exists) {
      // Remove from favorites
      const updated = favorites.filter(f => f.slug !== slug);
      localStorage.setItem('favoriteDrugs', JSON.stringify(updated));
      return false;
    } else {
      // Add to favorites
      const newFavorite: FavoriteDrug = {
        slug,
        name,
        addedAt: Date.now()
      };
      const updated = [newFavorite, ...favorites];
      localStorage.setItem('favoriteDrugs', JSON.stringify(updated));
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

// Clear all favorites
export function clearFavorites() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('favoriteDrugs');
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
}

// Get comparison candidate (for "Compare with..." feature)
export function getComparisonCandidate(): { slug: string; name: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('comparisonCandidate');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Set comparison candidate
export function setComparisonCandidate(slug: string, name: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('comparisonCandidate', JSON.stringify({ slug, name }));
  } catch (error) {
    console.error('Error setting comparison candidate:', error);
  }
}

// Clear comparison candidate
export function clearComparisonCandidate() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('comparisonCandidate');
  } catch (error) {
    console.error('Error clearing comparison candidate:', error);
  }
}
