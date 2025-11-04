import { Route, Routes } from 'react-router-dom';
import Login from './login';
import Financial from './financial';
import AuthRequired from '../components/AuthRequired';

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<AuthRequired />}>
        <Route path="/financial" element={<Financial />} />
      </Route>
    </Routes>
  );
};

export default Pages;
