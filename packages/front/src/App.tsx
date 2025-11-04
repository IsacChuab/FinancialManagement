import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';
import ThemeProvider from './providers/ThemeProvider';

function App() {
  return (
    <div>
      <ThemeProvider>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
