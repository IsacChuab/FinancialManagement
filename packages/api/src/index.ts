import express from 'express';
import cors from 'cors';
// import passport from 'passport';
import './auth';
// import authRouter from './auth';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './AppRoutes/index.js';
// import { connectDB } from './db';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// app.use(passport.initialize());

// app.use('/auth', authRouter);

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  }),
);

const PORT = process.env.PORT || 4000;

(async () => {
  // await connectDB();
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
})();
