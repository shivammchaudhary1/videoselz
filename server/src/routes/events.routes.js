import { Router } from 'express';
import { createEvent } from '../controllers/events.controller.js';

const eventsRouter = Router();

eventsRouter.post('/', createEvent);

export default eventsRouter;
