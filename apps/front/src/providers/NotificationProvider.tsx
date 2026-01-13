import { createContext, useContext } from 'react';

import { notification } from 'antd';
import { setNotify } from '../utils/notification/notify';

type NotifyApi = ReturnType<typeof notification.useNotification>[0];
const NotificationContext = createContext<NotifyApi | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  setNotify(api);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export const useNotify = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }

  return ctx;
};
