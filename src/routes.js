import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FilesController from './app/controllers/FilesController';

import authMiddleware from './app/middlewares/auth';

import uploadConfig from './config/multer';

const routes = new Router();

const upload = multer(uploadConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.get('/files', FilesController.index);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FilesController.store);

export default routes;
