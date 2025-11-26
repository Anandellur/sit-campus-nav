import { Search, MapPin, Navigation } from 'lucide-react';
import { useState, useMemo } from 'react';
import locations from '../data/locations.json';

interface SidebarProps {
    onLocationSelect: (location: any) => void;
}

export default function Sidebar({ onLocationSelect }: SidebarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLocations = useMemo(() => {
        if (!searchTerm) return locations;
        return locations.filter(loc =>
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="sidebar">
            <div className="p-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                    <Navigation className="text-[var(--primary-color)]" />
                    <h1 className="text-lg font-bold">SIT Campus Nav</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search buildings..."
                        className="input pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                    {filteredLocations.map(location => (
                        <button
                            key={location.id}
                            className="flex items-start gap-3 p-3 w-full text-left rounded-lg hover:bg-[var(--background)] transition-colors border border-transparent hover:border-[var(--border)]"
                            onClick={() => onLocationSelect(location)}
                        >
                            <MapPin className="text-[var(--primary-color)] w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <div className="font-medium">{location.name}</div>
                                <div className="text-sm text-[var(--text-secondary)]">{location.category}</div>
                            </div>
                        </button>
                    ))}

                    {filteredLocations.length === 0 && (
                        <div className="text-center text-[var(--text-secondary)] py-8">
                            No locations found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
