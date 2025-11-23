import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiMenu, FiActivity } from 'react-icons/fi';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role: string) => {
    return role === 'student' ? 'Sinh viên' : 'Giáo viên hướng dẫn';
  };

  const getOrgLabel = (org: string) => {
    return org === 'org1' ? 'Tổ chức 1 (Sinh viên)' : 'Tổ chức 2 (Giáo viên)';
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <FiHome size={24} />
          <h1 className="text-2xl font-bold">Quản Lý Đề Tài</h1>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <FiMenu size={24} />
        </button>

        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex gap-4 items-center flex-col md:flex-row`}>
          {user && (
            <>
              <button
                onClick={() => {
                  navigate('/blockchain-explorer');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <FiActivity size={18} />
                <span className="hidden sm:inline">Blockchain Explorer</span>
              </button>
              <div className="text-right text-sm">
                <p className="font-semibold">{user.name}</p>
                <p className="text-blue-100">{getRoleLabel(user.role)}</p>
                <p className="text-blue-100">{getOrgLabel(user.organization)}</p>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 btn btn-secondary">
                <FiLogOut />
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
