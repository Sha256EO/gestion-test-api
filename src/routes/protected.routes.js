import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/dashboard', isAuthenticated, (req, res, next) => {
    res.json( {message: `Welcome ${req.user.username}! You have access to this protected page`} );
});

export default router;