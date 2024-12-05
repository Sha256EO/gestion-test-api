import authRoutes from './src/routes/auth.routes.js';
import protectedRoutes from './src/routes/protected.routes.js';

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
}

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriend en el puerto ${PORT}`);
})
