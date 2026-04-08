import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useDeleteMember } from '../../hooks/useMembers.js';

export default function MemberTable({ members }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteMember();
  const isAdmin = user?.role === 'ADMIN';

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

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
            {isAdmin && <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>}
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
              {isAdmin && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/members/${m.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
