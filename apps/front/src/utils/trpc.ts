import type { TrpcRouter } from '../../../api/src/trpc/router';
import { httpBatchLink, createTRPCReact } from '@trpc/react-query';
import { type inferRouterOutputs } from '@trpc/server';
import superJSON from 'superjson';
import { notifyLink } from './notification/notifyLink';

export const trpc = createTRPCReact<TrpcRouter>();

export type RouterOutput = inferRouterOutputs<TrpcRouter>;
export type Bill = RouterOutput['bill']['allBills'][number];

export const trpcClient = trpc.createClient({
  links: [
    notifyLink(),
    httpBatchLink({
      url: `http://localhost:4000/trpc`,
      transformer: superJSON,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
