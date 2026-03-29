import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';

import adminRoutes from './routes/admin.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  }),
);
app.use(express.json());

app.get('/app', (req: Request, res: Response) => {
  res.send('Hello world');
})

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
