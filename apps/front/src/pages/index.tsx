import { Route, Routes } from 'react-router-dom';
import Login from './login';
import Financial from './financial';
import AuthRequired from '../components/AuthRequired';
import Layout from '../theme/Layout';

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<AuthRequired />}>
        <Route element={<Layout />}>
          <Route path="/financial" element={<Financial />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Pages;
