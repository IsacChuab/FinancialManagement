import { Button, Tooltip } from 'antd';
import { MdOutlineLogout } from 'react-icons/md';

const LogoutButton = () => {
  return (
    <div className="fixed right-15 top-1 ">
      <Tooltip title="Logout">
        <Button className="rounded-full!" type="primary" onClick={() => null}>
          <MdOutlineLogout />
        </Button>
      </Tooltip>
    </div>
  );
};

export default LogoutButton;
