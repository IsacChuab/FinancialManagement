import { notification } from 'antd';
import { setNotify } from '../utils/notification/notify';

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
