import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

export default routes;
