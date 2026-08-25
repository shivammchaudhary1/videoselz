import express from 'express';
import cors from 'cors';
import { envs } from './config/environments/env.js';

export const createApp = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // routes

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Videoselz Apis is running successfully',
    });
  });

  app.listen(envs.PORT, () => {
    console.log(`Server is running on port http://localhost:${envs.PORT}`);
  });
};
