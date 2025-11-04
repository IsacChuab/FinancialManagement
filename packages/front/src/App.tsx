import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </div>
  );
}

export default App;
