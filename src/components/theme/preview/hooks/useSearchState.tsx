import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function useSearchState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSearch, setShowSearch] = useState(false);
  
  // Get search query from URL params
  const searchQuery = searchParams.get("search") || "";

  // Show search box if there's a query
  useEffect(() => {
    setShowSearch(!!searchQuery);
  }, [searchQuery]);

  // Update search query in URL
  const handleSearchChange = (query: string) => {
    if (query) {
      searchParams.set("search", query);
      setShowSearch(true);
    } else {
      searchParams.delete("search");
      setShowSearch(false);
    }
    setSearchParams(searchParams);
  };

  return {
    searchQuery,
    showSearch,
    setShowSearch,
    handleSearchChange
  };
}