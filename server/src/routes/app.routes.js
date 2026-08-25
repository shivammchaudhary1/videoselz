import eventsRouter from './events.routes.js';
import analyticsRouter from './analytics.routes.js';

const appRouter = (app) => {
  app.use('/api/events', eventsRouter);
  app.use('/api/analytics', analyticsRouter);
};

export default appRouter;
