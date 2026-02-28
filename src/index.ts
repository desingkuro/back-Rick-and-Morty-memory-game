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
    origin: ['*', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
});

// ✅ Railway suele requerir una ruta raíz '/' para sus checks internos si no escanea el TCP
app.get('/', (_: express.Request, res: express.Response) => {
    res.send('✅ API de Rick and Morty funcionando correctamente!');
});


// Dejamos que Express asigne las interfaces por defecto ('0.0.0.0' o '::')
const PORT = process.env.PORT || 3000;

console.log(`Debug: process.env.PORT is ${process.env.PORT}`);

app.listen(Number(PORT), () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});


// ✅ Vercel usa este export
export default app;
