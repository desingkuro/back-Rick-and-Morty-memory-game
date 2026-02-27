import type { Request, Response } from 'express';
import type { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';


const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { user, password } = req.body;

  if (!user || !password) {
    res.status(400).json({ status: 'error', message: 'Usuario y contraseña son requeridos' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ status: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
    return;
  }

  try {
    const userExists = await pool.query(
      'SELECT id FROM users WHERE "user" = $1',
      [user]
    );

    if (userExists.rows.length > 0) {
      res.status(409).json({ status: 'error', message: 'El usuario ya está registrado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      'INSERT INTO users ("user", password) VALUES ($1, $2)',
      [user, hashedPassword]
    );

    res.status(201).json({ status: 'success', message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { user, password } = req.body;

  if (!user || !password) {
    res.status(400).json({ status: 'error', message: 'Usuario y contraseña son requeridos' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE "user" = $1',
      [user]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ status: 'error', message: 'Credenciales no validas' });
      return;
    }

    const userDetails = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch) {
      res.status(401).json({ status: 'error', message: 'Password no valido' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET no está definida en las variables de entorno');
      res.status(500).json({ status: 'error', message: 'Error de configuración del servidor' });
      return;
    }

    const jwtOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRE_IN ?? '24h') as SignOptions['expiresIn']
    };

    const token = jwt.sign(
      { id: userDetails.id, user: userDetails.user },
      process.env.JWT_SECRET as string,
      jwtOptions
    );

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      token,
      user: { id: userDetails.id, user: userDetails.user }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};