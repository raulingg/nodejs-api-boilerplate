import type { Application, Request, Response } from 'express';
import { router } from './components/images/handlers/index.js';

export default (app: Application) => {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello world - Images API');
  });

  app.use('/images', router);
};
