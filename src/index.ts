import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import './db/pool';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
});

// ✅ Solo escucha en local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3200;
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

// ✅ Vercel usa este export
export default app;
