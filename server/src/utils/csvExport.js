function escapeCSV(value) {
  if (!value) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSV(members) {
  const headers = ['Name', 'Email', 'Cohort', 'Graduation Year', 'Tracks', 'Roles', 'Companies', 'Titles', 'LinkedIn'];

  const rows = members.map(m => [
    m.name,
    m.email || '',
    m.cohort,
    m.graduationYear,
    m.tracks.map(t => t.name).join('; '),
    m.roles.map(r => r.name).join('; '),
    m.experiences.map(e => e.company).join('; '),
    m.experiences.map(e => e.title).join('; '),
    m.linkedinUrl || '',
  ]);

  const lines = [headers, ...rows].map(row => row.map(escapeCSV).join(','));
  return lines.join('\n');
}
