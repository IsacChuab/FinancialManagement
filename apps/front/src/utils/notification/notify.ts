import type { ArgsProps } from 'antd/es/notification';
import type { NotificationInstance } from 'antd/es/notification/interface';

let notifyApi: NotificationInstance | null = null;

export const setNotify = (api: NotificationInstance) => {
  notifyApi = api;
};

export const notify = {
  success: (options: ArgsProps) => notifyApi?.success(options),
  error: (options: ArgsProps) => notifyApi?.error(options),
  info: (options: ArgsProps) => notifyApi?.info(options),
  warning: (options: ArgsProps) => notifyApi?.warning(options),
};

export function handleReactQueryError(error: unknown) {
   if (error instanceof Error) {
    notify.error({
      title: 'Erro inesperado',
      description: error.message,
    });

    return;
  }

  notify.error({
    title: 'Erro inesperado',
    description: 'Algo deu errado',
  });
}
