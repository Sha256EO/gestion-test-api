import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Leer el token del encabezado "Authorization"

    if (!token) {
        return res.status(401).json({ message: 'Desautorizado' });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};
