import { useAuth } from '../hooks/useAuth.jsx';
import { useUsers, useUpdateUserRole } from '../hooks/useMembers.js';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();

  const handleToggle = (user) => {
    const newRole = user.role === 'ADMIN' ? 'VIEWER' : 'ADMIN';
    updateRole.mutate({ id: user.id, role: newRole });
  };

  if (isLoading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 text-sm">{users?.length || 0} registered user{users?.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="px-4 py-3 font-medium text-gray-600">Role</th>
              <th className="px-4 py-3 font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <div className="flex items-center gap-2">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full" onError={e => e.target.style.display = 'none'} />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {u.name}
                    {u.id === currentUser.id && <span className="text-xs text-gray-400">(you)</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.id === currentUser.id ? (
                    <span className="text-xs text-gray-400">—</span>
                  ) : (
                    <button
                      onClick={() => handleToggle(u)}
                      disabled={updateRole.isPending}
                      className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                        u.role === 'ADMIN'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {u.role === 'ADMIN' ? 'Demote to Viewer' : 'Promote to Admin'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
