import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import './db/pool';

const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
