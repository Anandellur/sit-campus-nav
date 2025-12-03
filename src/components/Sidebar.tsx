import { Search, MapPin, X } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import locations from '../data/locations.json';

interface SearchBarProps {
    onLocationSelect: (location: any) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const filteredLocations = useMemo(() => {
        if (!searchTerm) return locations;
        return locations.filter(loc =>
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const showResults = isFocused && (searchTerm.length > 0 || filteredLocations.length > 0);

    // Handle click outside to close results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationClick = (location: any) => {
        onLocationSelect(location);
        setSearchTerm('');
        setIsFocused(false);
    };

    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div className="search-container" ref={searchRef}>
            <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search for buildings, departments..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                    />
                    {searchTerm && (
                        <button
                            className="clear-button"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {showResults && (
                    <div className="search-results">
                        {filteredLocations.length > 0 ? (
                            filteredLocations.map(location => (
                                <button
                                    key={location.id}
                                    className="location-item"
                                    onClick={() => handleLocationClick(location)}
                                >
                                    <MapPin className="location-icon" size={20} />
                                    <div className="location-details">
                                        <div className="location-name">{location.name}</div>
                                        <div className="location-category">{location.category}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="no-results">
                                No locations found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
