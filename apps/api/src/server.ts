import cors from 'cors';
import express from 'express';
import { trpcRouter } from './trpc/router.js';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc/context.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.set('trust proxy', true);

app.get('/', (_req, res) => {
  res.status(200).json({ status: 'Working!' });
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext,
  }),
);

app.use('/{*splat}', (_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export const listen = () => {
  return new Promise<void>((resolve, reject) => {
    app.listen(PORT, (error?: Error) => {
      if (error) {
        return reject(error);
      }

      console.log(`API listening on ${PORT}`);
      resolve();
    });
  });
};
