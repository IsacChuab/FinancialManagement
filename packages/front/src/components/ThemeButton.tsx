import { Button, Tooltip } from 'antd';
import { useTheme } from '../hooks/theme';
import { MdLightMode } from 'react-icons/md';
import { MdOutlineNightlightRound } from 'react-icons/md';

const ThemeButton = () => {
  const { mode, setMode } = useTheme();

  return (
    <>
      <Tooltip title="Change Theme">
        <Button
          className="rounded-full!"
          type="primary"
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        >
          {mode === 'light' ? <MdOutlineNightlightRound /> : <MdLightMode />}
        </Button>
      </Tooltip>
    </>
  );
};

export default ThemeButton;
