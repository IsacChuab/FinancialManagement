import { Outlet } from 'react-router-dom';
import ThemeButton from '../components/ThemeButton';
import LogoutButton from '../components/LogoutButton';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full mb-5 h-20 p-3 m-auto max-w-7xl flex gap-3 justify-end">
        <ThemeButton />
        <LogoutButton />
      </div>

      <main className="grow w-full m-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
