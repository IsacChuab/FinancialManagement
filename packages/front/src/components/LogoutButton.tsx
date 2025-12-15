import { Button, Tooltip } from 'antd';
import { MdOutlineLogout } from 'react-icons/md';
import { trpc } from '../utils/trpc';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = trpc.auth.logout.useMutation();

  const handleLogout = () => {
    logout.mutate();

    navigate('/');
  };

  return (
    <div className="fixed right-15 top-1 ">
      <Tooltip title="Logout">
        <Button className="rounded-full!" type="primary" onClick={handleLogout}>
          <MdOutlineLogout />
        </Button>
      </Tooltip>
    </div>
  );
};

export default LogoutButton;
