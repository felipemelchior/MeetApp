import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FilesController from './app/controllers/FilesController';
import MeetupController from './app/controllers/MeetupController';
import SubscribeController from './app/controllers/SubscribeController';
import OrganizerController from './app/controllers/OrganizerController';

import authMiddleware from './app/middlewares/auth';

import uploadConfig from './config/multer';

const routes = new Router();

const upload = multer(uploadConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.get('/files', FilesController.index);

routes.put('/users', UserController.update);

routes.get('/organizer', OrganizerController.index);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups', MeetupController.delete);

routes.get('/subscription', SubscribeController.index);
routes.post('/subscription', SubscribeController.store);

routes.post('/files', upload.single('file'), FilesController.store);

export default routes;
