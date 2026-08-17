import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { FaUserGear } from 'react-icons/fa6';
import { MdLightMode, MdOutlineLogout, MdOutlineNightlightRound } from 'react-icons/md';
import { LiaUserEditSolid } from 'react-icons/lia';
import Dropdown from 'antd/es/dropdown/dropdown';
import { Alert, type MenuProps } from 'antd';

import { useTheme } from '../hooks/theme';
import { trpc } from '../utils/trpc';
import Logo from '../assets/zc_logo.png';
import GridPattern from '../assets/svgs/GridPattern';
import ChangePassowrd from '../components/ChangePassword';
import { useOffline } from '../providers/OfflineProvider';
import { WAS_LOGGED_IN_KEY } from '../utils/authConstants';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mode, setMode } = useTheme();
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem(WAS_LOGGED_IN_KEY);
      void navigate('/');
    },
  });

  const handleLogout = () => {
    logout.mutate();
  };

  const items: MenuProps['items'] = [
    {
      key: 'editPassword',
      icon: <LiaUserEditSolid />,
      onClick: () => setIsOpen(true),
      label: 'Change Password',
      disabled: isOffline,
    },
    {
      key: 'theme',
      icon: mode === 'light' ? <MdOutlineNightlightRound /> : <MdLightMode />,
      onClick: () => setMode(mode === 'light' ? 'dark' : 'light'),
      label: 'Switch Theme',
    },
    {
      key: 'logout',
      icon: <MdOutlineLogout />,
      onClick: handleLogout,
      label: 'Log Out',
      disabled: isOffline,
    },
  ];

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
      setMode(storedTheme as 'light' | 'dark');
    }
  }, [setMode]);

  return (
    <div className="flex flex-col min-h-screen">
      {isOffline && (
        <Alert
          type="warning"
          banner
          showIcon
          message="You are offline. The data shown is from your last access and all actions are disabled."
        />
      )}

      <header className="sticky top-0 z-20 overflow-hidden bg-linear-to-r from-slate-900 via-slate-800 to-blue-950 shadow-md">
        <GridPattern />

        <div className="relative z-10 w-full py-3 px-4 md:px-8 m-auto max-w-7xl flex gap-3 justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-11 w-11 bg-blue-50 rounded-full object-cover" />
            <span className="hidden sm:inline text-slate-100 text-lg font-semibold tracking-wide">
              Financial Management
            </span>
          </div>

          <span>
            <Dropdown menu={{ items }} placement="bottomRight">
              <FaUserGear className="h-7 w-7 text-slate-100 hover:text-white cursor-pointer transition-colors" />
            </Dropdown>
          </span>
        </div>
      </header>

      <main className="grow w-full m-auto max-w-7xl px-4 md:px-8 py-6">
        <Outlet />
      </main>

      <ChangePassowrd isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Layout;
