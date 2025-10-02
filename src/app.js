import express from 'express';
import authRoutes from './api/user.routes.js';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('rodando....');
});

app.use('/api/auth', authRoutes);

export default app;