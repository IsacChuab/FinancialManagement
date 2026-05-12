import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { trpc } from '../utils/trpc';
import { useOffline } from '../providers/OfflineProvider';
import { WAS_LOGGED_IN_KEY } from '../utils/authConstants';

const AuthRequired = () => {
  const navigate = useNavigate();
  const { isOffline, markNetworkFailed } = useOffline();
  const wasLoggedIn = localStorage.getItem(WAS_LOGGED_IN_KEY) === 'true';

  const { data, isLoading, isError, error } = trpc.auth.me.useQuery(undefined, {
    enabled: !isOffline,
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem(WAS_LOGGED_IN_KEY, 'true');
    }
  }, [data]);

  if (isOffline && wasLoggedIn) {
    return <Outlet />;
  }

  if (isOffline && !wasLoggedIn) {
    void navigate('/');
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (isError) {
    const isNetworkError = !error?.data;

    if (isNetworkError && wasLoggedIn) {
      markNetworkFailed();
      return <Outlet />;
    }

    console.log('Error:', error);
    void navigate('/');
    return null;
  }

  if (!data) {
    void navigate('/');
    return null;
  }

  return <Outlet />;
};

export default AuthRequired;
