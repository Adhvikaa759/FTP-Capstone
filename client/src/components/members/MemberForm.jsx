import { useState } from 'react';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import { useTracks, useRoles } from '../../hooks/useMembers.js';

const COHORTS = ['Spring 2025', 'Fall 2025', 'Spring 2026'];

export default function MemberForm({ initialData, onSubmit, isSubmitting }) {
  const { data: tracks = [] } = useTracks();
  const { data: roles = [] } = useRoles();

  const [form, setForm] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    cohort: initialData?.cohort || '',
    graduationYear: initialData?.graduationYear || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    bio: initialData?.bio || '',
    trackIds: initialData?.tracks?.map(t => t.id) || [],
    roleIds: initialData?.roles?.map(r => r.id) || [],
    experiences: initialData?.experiences?.map(e => ({ company: e.company, title: e.title, type: e.type })) || [],
  });

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleId = (key, id) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter(x => x !== id) : [...prev[key], id],
    }));
  };

  const addExperience = () => {
    setForm(prev => ({ ...prev, experiences: [...prev.experiences, { company: '', title: '', type: 'INTERNSHIP' }] }));
  };

  const updateExperience = (i, field, value) => {
    setForm(prev => {
      const exps = [...prev.experiences];
      exps[i] = { ...exps[i], [field]: value };
      return { ...prev, experiences: exps };
    });
  };

  const removeExperience = (i) => {
    setForm(prev => ({ ...prev, experiences: prev.experiences.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.cohort) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name *" value={form.name} onChange={e => setField('name', e.target.value)} required />
        <Input label="Email" type="email" value={form.email} onChange={e => setField('email', e.target.value)} />
        <Select
          label="Cohort *"
          value={form.cohort}
          onChange={e => setField('cohort', e.target.value)}
          placeholder="Select cohort"
          options={COHORTS.map(c => ({ value: c, label: c }))}
        />
        <Input label="Graduation Year" type="number" value={form.graduationYear} onChange={e => setField('graduationYear', e.target.value)} />
        <Input label="LinkedIn URL" value={form.linkedinUrl} onChange={e => setField('linkedinUrl', e.target.value)} className="sm:col-span-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          value={form.bio}
          onChange={e => setField('bio', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tracks</label>
        <div className="flex flex-wrap gap-2">
          {tracks.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleId('trackIds', t.id)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${form.trackIds.includes(t.id)
                ? 'text-white border-transparent'
                : 'text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              style={form.trackIds.includes(t.id) ? { backgroundColor: t.color } : {}}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
        <div className="flex flex-wrap gap-2">
          {roles.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => toggleId('roleIds', r.id)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${form.roleIds.includes(r.id)
                ? 'bg-gray-800 text-white border-transparent'
                : 'text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Experience</label>
          <button type="button" onClick={addExperience} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + Add Experience
          </button>
        </div>
        <div className="space-y-3">
          {form.experiences.map((exp, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg relative">
              <Input label="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
              <Input label="Title" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} />
              <div className="flex items-end gap-2">
                <Select
                  label="Type"
                  value={exp.type}
                  onChange={e => updateExperience(i, 'type', e.target.value)}
                  options={[{ value: 'INTERNSHIP', label: 'Internship' }, { value: 'FULLTIME', label: 'Full-Time' }]}
                />
                <button type="button" onClick={() => removeExperience(i)} className="text-red-500 hover:text-red-700 pb-2">
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Member' : 'Add Member'}
      </Button>
    </form>
  );
}
