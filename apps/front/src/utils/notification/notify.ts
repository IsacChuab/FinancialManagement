import type { ArgsProps } from 'antd/es/notification';

let notifyApi: any;

export const setNotify = (api: any) => {
  notifyApi = api;
};

export const notify = {
  success: (options: ArgsProps) => notifyApi?.success(options),
  error: (options: ArgsProps) => notifyApi?.error(options),
  info: (options: ArgsProps) => notifyApi?.info(options),
  warning: (options: ArgsProps) => notifyApi?.warning(options),
};
