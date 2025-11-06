import { Navigate, Outlet } from 'react-router-dom';

const AuthRequired = () => {
  // const { user } = useAuth();
  const user = false;

  if (!user) {
    console.log('User is not authenticated');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthRequired;
