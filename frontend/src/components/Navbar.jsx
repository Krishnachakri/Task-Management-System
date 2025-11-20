import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import avplLogo from '../assets/avpl-logo.svg';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src={avplLogo} alt="AVPL International" className="h-10 w-auto drop-shadow" />
              <div className="leading-tight">
                <p className="text-sm tracking-[0.25em] uppercase text-blue-100">
                  AVPL International
                </p>
                <p className="text-xl font-bold">Task Manager</p>
              </div>
            </Link>
            {user && (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">
                  {user.username} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


