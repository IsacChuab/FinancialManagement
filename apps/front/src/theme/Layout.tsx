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
      label: 'Editar senha',
      disabled: isOffline,
    },
    {
      key: 'theme',
      icon: mode === 'light' ? <MdOutlineNightlightRound /> : <MdLightMode />,
      onClick: () => setMode(mode === 'light' ? 'dark' : 'light'),
      label: 'Trocar tema',
    },
    {
      key: 'logout',
      icon: <MdOutlineLogout />,
      onClick: handleLogout,
      label: 'Sair',
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
          message="Você está offline. Os dados exibidos são do último acesso e todas as ações estão desativadas."
        />
      )}

      <div className="w-full py-3 px-8 m-auto max-w-7xl flex gap-3 justify-between items-center ">
        <img src={Logo} alt="Logo" className="h-30 bg-blue-50 rounded-full" />

        <span>
          <Dropdown menu={{ items }} className="cursor-pointer m-auto" placement="bottomRight">
            <FaUserGear className="h-8 w-8" />
          </Dropdown>
        </span>
      </div>

      <main className="grow w-full m-auto max-w-7xl ">
        <Outlet />
      </main>

      <ChangePassowrd isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Layout;
