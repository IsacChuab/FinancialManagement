import type { TRPCLink } from '@trpc/client';
import { observable } from '@trpc/server/observable';
import { notify } from './notify';

type NotifyResponse = {
  success?: boolean;
  message?: string;
};

export const notifyLink = (): TRPCLink<any> => {
  return () => {
    return ({ op, next }) => {
      return observable((observer) => {
        const subscription = next(op).subscribe({
          next(result) {
            if (op.type === 'mutation') {
              const data = result.result?.data as NotifyResponse | undefined;

              if (data?.success === true && data.message) {
                notify.success({ message: data.message });
              }

              if (data?.success === false && data.message) {
                notify.error({ message: data.message });
              }
            }

            observer.next(result);
          },

          error(err) {
            observer.error(err);
          },

          complete() {
            observer.complete();
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    };
  };
};
