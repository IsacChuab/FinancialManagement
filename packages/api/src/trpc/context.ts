import type * as trpcExpress from '@trpc/server/adapters/express';
import cookie from 'cookie';

export interface AuthUser {
  id: string;
  email: string;
}

export const createContext = async ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token ?? null;

  return {
    token,
    user: null as null | AuthUser,
    res,
    req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
