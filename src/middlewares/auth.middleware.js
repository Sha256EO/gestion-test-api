import { verifyToken } from "../utils/jwt.js";

export const isAuthenticated = (req, res, next) => {
    console.log('Cookie:', req.cookies);
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json( { message: 'Desautorizado' } );
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json( { message: 'token invalido' } );
    }
};