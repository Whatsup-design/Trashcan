import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
