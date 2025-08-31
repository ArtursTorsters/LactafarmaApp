import { useState, useEffect, useRef } from 'react';
import drugSearchService, { DrugSuggestion } from '../services/DrugSearchService';

export const useSearchHooks = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DrugSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.length >= 2) {
            searchTimeoutRef.current = setTimeout(() => {
                handleSearch(query);
            }, 300);
        } else {
            setResults([]);
            setShowResults(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query]);

    const handleSearch = async (text: string) => {
        setError(null);
        setLoading(true);

        try {
            const suggestions = await drugSearchService.searchDrugs(text);
            setResults(suggestions);
            setShowResults(true);
        } catch (err: any) {
            setError(err?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowResults(false);
        }, 200);
    };

    const handleFocus = () => {
        if (results.length > 0) {
            setShowResults(true);
        }
    };

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        showResults,
        handleBlur,
        handleFocus,
    };
};
