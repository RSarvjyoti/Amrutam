import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { doctorRoutes } from './routes/doctorRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import './config/redis.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('This is the home route.');
})

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

await connectDB();
app.listen(env.PORT, () => console.log(`API running on :${env.PORT}`));