import { useState, useMemo } from 'react';

export function useFilters() {
  const [filters, setFilters] = useState({
    search: '',
    cohort: '',
    track: '',
    role: '',
    graduationYear: '',
    company: '',
  });

  const activeFilters = useMemo(() => {
    const active = {};
    for (const [k, v] of Object.entries(filters)) {
      if (v) active[k] = v;
    }
    return active;
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', cohort: '', track: '', role: '', graduationYear: '', company: '' });
  };

  return { filters, activeFilters, updateFilter, clearFilters };
}
