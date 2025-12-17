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
    <>
      <Tooltip title="Logout">
        <Button className="rounded-full!" type="primary" onClick={handleLogout}>
          <MdOutlineLogout />
        </Button>
      </Tooltip>
    </>
  );
};

export default LogoutButton;
