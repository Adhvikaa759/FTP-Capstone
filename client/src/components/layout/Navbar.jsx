import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { logout } from '../../api/auth.js';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">FTP</span>
            <span className="text-gray-500 hidden sm:inline">Member Tracker</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <>
                  <Link
                    to="/users"
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/members/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    + Add Member
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2">
                {user.avatarUrl && !imgError ? (
                  <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-gray-700 hidden sm:inline">{user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
