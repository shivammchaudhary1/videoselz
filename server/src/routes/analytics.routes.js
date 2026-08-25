import { Router } from 'express';
import { getVideoAnalytics } from '../controllers/analytics.controller.js';

const analyticsRouter = Router();

analyticsRouter.get('/videos', getVideoAnalytics);

export default analyticsRouter;
