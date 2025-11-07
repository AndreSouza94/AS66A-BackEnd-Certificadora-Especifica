import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenValido = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({ msg: "Token não existe" });
    }

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({msg: "Acesso negado"});
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decodedJWT = jwt.verify(token, secret); 
        
        if(decodedJWT) {
            req.user = {id: decodedJWT.id};
            next();
        }
    } catch (error) {
        return res.status(400).json({msg: "Token inválido", error: error.message});
    }
}