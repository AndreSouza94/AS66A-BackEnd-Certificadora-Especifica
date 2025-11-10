import express from 'express';
import authRoutes from './api/index.js';
import helmet from 'helmet';
import cors from 'cors';
import MongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

app.use(helmet());
app.use(cors());
app.use(MongoSanitize());
app.use(xss());

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('A API está rodando....');
});

app.use('/api/', authRoutes);

export default app;