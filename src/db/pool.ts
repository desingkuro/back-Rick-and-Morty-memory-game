import { Pool } from 'pg';

let _pool: Pool | null = null;

const getPool = (): Pool => {
    if (!_pool) {
        _pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false },
        });

        _pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
                "user" TEXT UNIQUE,
                password TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `)
        .then(() => console.log('✅ Tabla users lista o ya existente'))
        .catch((err) => console.error('❌ Error verificando tabla:', err));
    }
    return _pool;
};

export default getPool();

