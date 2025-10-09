import express from 'express';
import authRoutes from './api/index.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('A API está rodando....');
});

app.use('/api/', authRoutes);

export default app;