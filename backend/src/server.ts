import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/app', (req: Request, res: Response) => {
  res.send('Hello world');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})