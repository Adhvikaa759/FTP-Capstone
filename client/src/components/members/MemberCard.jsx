import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useDeleteMember } from '../../hooks/useMembers.js';

export default function MemberCard({ member }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const deleteMutation = useDeleteMember();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/members/${member.id}/edit`);
  };
  return (
    <Link
      to={`/members/${member.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.cohort} &middot; Class of {member.graduationYear}</p>
        </div>
        {!member.isActive && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {member.tracks.map(t => (
          <span
            key={t.id}
            className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: t.color || '#6B7280' }}
          >
            {t.name}
          </span>
        ))}
        {member.roles.map(r => (
          <span key={r.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {r.name}
          </span>
        ))}
      </div>

      {member.experiences.length > 0 && (
        <p className="text-sm text-gray-600">
          {member.experiences.map(e => e.company).join(', ')}
        </p>
      )}

      {user?.role === 'ADMIN' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={handleEdit}
            className="text-xs px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </Link>
  );
}
