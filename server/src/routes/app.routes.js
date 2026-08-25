import eventsRouter from './events.routes.js';

const appRouter = (app) => {
  app.use('/api/events', eventsRouter);
};

export default appRouter;
