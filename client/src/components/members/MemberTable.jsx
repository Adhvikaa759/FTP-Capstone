import { Link } from 'react-router-dom';

export default function MemberTable({ members }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-medium text-gray-600">Name</th>
            <th className="px-4 py-3 font-medium text-gray-600">Cohort</th>
            <th className="px-4 py-3 font-medium text-gray-600">Tracks</th>
            <th className="px-4 py-3 font-medium text-gray-600">Roles</th>
            <th className="px-4 py-3 font-medium text-gray-600">Companies</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {members.map(m => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link to={`/members/${m.id}`} className="text-blue-600 hover:underline font-medium">
                  {m.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-600">{m.cohort}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {m.tracks.map(t => (
                    <span key={t.id} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: t.color || '#6B7280' }}>
                      {t.name}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{m.roles.map(r => r.name).join(', ')}</td>
              <td className="px-4 py-3 text-gray-600">{m.experiences.map(e => e.company).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
