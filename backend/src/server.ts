import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
