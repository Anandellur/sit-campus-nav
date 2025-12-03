import { Crosshair, Loader2 } from 'lucide-react';

interface LocationButtonProps {
    onClick: () => void;
    loading?: boolean;
    active?: boolean;
}

export default function LocationButton({ onClick, loading = false, active = false }: LocationButtonProps) {
    return (
        <button
            className={`location-button ${loading ? 'loading' : ''} ${active ? 'active' : ''}`}
            onClick={onClick}
            title="Show my location"
            aria-label="Show my location"
        >
            {loading ? (
                <Loader2 size={20} />
            ) : (
                <Crosshair size={20} />
            )}
        </button>
    );
}
