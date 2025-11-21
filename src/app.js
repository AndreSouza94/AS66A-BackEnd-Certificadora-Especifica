import express from 'express';
import authRoutes from './api/index.js';
import helmet from 'helmet';
import cors from 'cors';
import expressSanitizer from 'express-sanitizer';
import {xss} from 'express-xss-sanitizer';

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('A API está rodando....');
});

app.use('/api/', expressSanitizer(), authRoutes);

export default app;