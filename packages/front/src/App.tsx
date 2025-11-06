import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';
import ThemeProvider from './providers/ThemeProvider';
import ThemeButton from './components/ThemeButton';

function App() {
  return (
    <div>
      <ThemeProvider>
        <BrowserRouter>
          <ThemeButton />

          <Pages />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
