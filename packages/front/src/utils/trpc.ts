import type { TrpcRouter } from '../../../api/src/trpc/router';
import { httpBatchLink, createTRPCReact } from '@trpc/react-query';
import { type inferRouterOutputs } from '@trpc/server';
import superJSON from 'superjson';

export const trpc = createTRPCReact<TrpcRouter>();

export type RouterOutput = inferRouterOutputs<TrpcRouter>;

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `http://localhost:4000/trpc`,
      headers: () => ({
        authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
      transformer: superJSON,
    }),
  ],
});
