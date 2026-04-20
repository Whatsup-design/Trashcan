import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import deviceRoutes from "./routes/device.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use("/device", deviceRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
