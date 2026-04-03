import Select from '../ui/Select.jsx';
import { useTracks, useRoles } from '../../hooks/useMembers.js';

const COHORTS = ['Spring 2025', 'Fall 2025', 'Spring 2026'];
const GRAD_YEARS = [2025, 2026, 2027];

export default function FilterPanel({ filters, onFilterChange, onClear }) {
  const { data: tracks = [] } = useTracks();
  const { data: roles = [] } = useRoles();

  const hasFilters = filters.cohort || filters.track || filters.role || filters.graduationYear;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Select
        placeholder="All Cohorts"
        value={filters.cohort}
        onChange={e => onFilterChange('cohort', e.target.value)}
        options={COHORTS.map(c => ({ value: c, label: c }))}
      />
      <Select
        placeholder="All Tracks"
        value={filters.track}
        onChange={e => onFilterChange('track', e.target.value)}
        options={tracks.map(t => ({ value: t.name, label: t.name }))}
      />
      <Select
        placeholder="All Roles"
        value={filters.role}
        onChange={e => onFilterChange('role', e.target.value)}
        options={roles.map(r => ({ value: r.name, label: r.name }))}
      />
      <Select
        placeholder="All Years"
        value={filters.graduationYear}
        onChange={e => onFilterChange('graduationYear', e.target.value)}
        options={GRAD_YEARS.map(y => ({ value: y, label: String(y) }))}
      />
      {hasFilters && (
        <button onClick={onClear} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Clear filters
        </button>
      )}
    </div>
  );
}
