import { Outlet, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';

const AuthRequired = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = trpc.auth.me.useQuery();

  if (isLoading) return;

  if (isError || !data) {
    console.log('Error:', error);

    void navigate('/');
  }

  return <Outlet />;
};

export default AuthRequired;
