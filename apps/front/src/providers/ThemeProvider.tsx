import { ConfigProvider, theme as antdTheme } from 'antd';

import { useTheme } from '../hooks/theme';
import { lightTokens, darkTokens } from '../theme/colorsTokens';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  const algorithm = mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider
      theme={{
        algorithm,
        token: mode === 'dark' ? darkTokens : lightTokens,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
