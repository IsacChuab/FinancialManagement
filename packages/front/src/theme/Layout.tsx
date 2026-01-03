import { Outlet, useNavigate } from 'react-router-dom';

import Dropdown from 'antd/es/dropdown/dropdown';
import type { MenuProps } from 'antd';
import { trpc } from '../utils/trpc';
import { useTheme } from '../hooks/theme';

import Logo from '../assets/zc logo.png';
import { FaUserGear } from 'react-icons/fa6';
import { MdLightMode, MdOutlineLogout, MdOutlineNightlightRound } from 'react-icons/md';
import { LiaUserEditSolid } from 'react-icons/lia';

const Layout = () => {
  const { mode, setMode } = useTheme();
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation();

  const handleLogout = () => {
    logout.mutate();

    navigate('/');
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      icon: <LiaUserEditSolid />,
      label: 'Editar senha',
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
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
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
    </div>
  );
};

export default Layout;
