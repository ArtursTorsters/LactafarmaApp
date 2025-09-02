import { useState, useEffect, useRef } from 'react';
import drugSearchService from '../services/DrugSearchService';
import {
  DrugSuggestion,
  DrugDetails,
  convertDetailsToUIDrug,
  Drug
} from '../types/index';

export const useSearchHooks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DrugSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // const handleBlur = () => {
  //   setTimeout(() => {
  //     setShowResults(false);
  //   }, 200);
  // };

  const handleFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleDrugSelect = async (suggestion: DrugSuggestion) => {
    setShowResults(false);
    setLoadingDetails(true);
    setError(null);

    try {
      const details = await drugSearchService.getDrugDetails(suggestion.name);
      console.log(details);

      if (details) {
        setSelectedDrug(details);
      } else {
        setError('Drug details not found');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to get drug details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const clearSelectedDrug = () => {
    setSelectedDrug(null);
  };

  // Helper function to convert selectedDrug to UI Drug format
  const getSelectedDrugForUI = (): Drug | null => {
    if (!selectedDrug) return null;
    return convertDetailsToUIDrug(selectedDrug);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    showResults,
    selectedDrug,
    selectedDrugForUI: getSelectedDrugForUI(),
    loadingDetails,
    // handleBlur,
    handleFocus,
    handleDrugSelect,
    clearSelectedDrug,
  };
};
