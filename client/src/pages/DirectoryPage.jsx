import { useState } from 'react';
import { useMembersList } from '../hooks/useMembers.js';
import { useFilters } from '../hooks/useFilters.js';
import { useAuth } from '../hooks/useAuth.jsx';
import SearchBar from '../components/filters/SearchBar.jsx';
import FilterPanel from '../components/filters/FilterPanel.jsx';
import MemberTable from '../components/members/MemberTable.jsx';
import MemberCard from '../components/members/MemberCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function DirectoryPage() {
  const { user } = useAuth();
  const { filters, activeFilters, updateFilter, clearFilters } = useFilters();
  const { data: members, isLoading, error } = useMembersList(activeFilters);
  const [view, setView] = useState('table');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-gray-500 text-sm">
            {members ? `${members.length} member${members.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === 'ADMIN' && (
            <a
              href="/api/export/members/csv"
              className="text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-2 rounded-lg"
            >
              Export CSV
            </a>
          )}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 text-sm ${view === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Table
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-2 text-sm ${view === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      <SearchBar value={filters.search} onChange={v => updateFilter('search', v)} />
      <FilterPanel filters={filters} onFilterChange={updateFilter} onClear={clearFilters} />

      {isLoading && <LoadingSpinner className="py-12" />}

      {error && (
        <div className="text-center py-12 text-red-600">
          Failed to load members. Please try again.
        </div>
      )}

      {members && members.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No members found matching your filters.
        </div>
      )}

      {members && members.length > 0 && (
        view === 'table'
          ? <MemberTable members={members} />
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{members.map(m => <MemberCard key={m.id} member={m} />)}</div>
      )}
    </div>
  );
}
