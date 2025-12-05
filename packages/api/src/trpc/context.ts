import type * as trpcExpress from '@trpc/server/adapters/express';

export interface AuthUser {
  id: string;
  email: string;
}

export const createContext = async ({ req }: trpcExpress.CreateExpressContextOptions) => {
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');

  return {
    token,
    user: null as null | AuthUser,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
