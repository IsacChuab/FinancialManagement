import { Button, theme } from 'antd';
import { useTheme } from '../../hooks/theme';

const Login = () => {
  const { mode, setMode } = useTheme();
  const { token } = theme.useToken();

  return (
    <div>
      <h1 className="text-lime-900 text-6xl">Login</h1>
      <Button
        type="default"
        // style={{ backgroundColor: token.colorError }}
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      >
        {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
      </Button>
    </div>
  );
};

export default Login;
