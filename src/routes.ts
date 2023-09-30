import type { Application, Request, Response } from 'express';
import { router } from './components/images/handlers/index.js';
import mongoose from 'mongoose';

export default (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world - Images API');
  });

  app.get('/health', async (req: Request, resp: Response) => {
    const result = await mongoose.connection.db.command({ ping: 1 });

    if (result.ok === 0) {
      return resp.status(503).json({
        status: 'error',
        error: {
          mongo: { status: 'down' },
        },
      });
    }

    resp.status(200).json({
      status: 'ok',
      info: {
        mongo: { status: 'up' },
      },
    });
  });

  app.use('/images', router);
};
