import bcrypt from 'bcrypt';

import { pool } from '../config/db.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json( { message: 'El usuario y la contraseña son requeridos' } );
    }

    try {
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json( {mesasge: 'El usuario ya existe' } );
        }
    } catch (error) {
        res.status(500).json( { message: 'Error durante la consulta' } );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        )

        res.status(201).json( { message: 'Registro exitoso', userId: result.insertId } );
    } catch (error) {
        res.status(500).json( { message: 'Ocurrio un error durante el registro' } );
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json( { message: 'El usuario y la contraseña son requeridos' } );
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json( { message: 'Credenciales invalidas' } ); 
        }

        const token = generateToken( { id: user.id, username: user.username } );
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'none'
        });
        res.json( { message: 'Logeo exitoso' } );
    } catch (error) {
        res.status(500).json( { message: 'Error durante el logeo' } );
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json( { message: 'Logout exitoso' } );
};