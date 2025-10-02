import express from 'express';
import authRoutes from './api/auth.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('A API está rodando....');
});

app.use('/api/auth', authRoutes);

export default app;