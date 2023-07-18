import fs from "fs";
import jwt from "jsonwebtoken";

export function Auth(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(400).json({ "message": "Utilizador não autenticado!" });
    }
    const parts = authHeader.split(' ');
    if(parts.length !== 2){
        return res.status(400).json({ "message": "Problemas na autenticação!" });
    }
    const [ scheme, token ] = parts;
    if(scheme !== "Bearer"){
        return res.status(400).json({ "message": "Formato de autenticação inválido!" });
    }
    const publicKey = fs.readFileSync('src/keys/public.key');
    jwt.verify(token, publicKey, async (err, decoded) => {
        if(err){
            return res.status(403).json({ "message": "Tempo de sessão expirado!" });
        }else{
            req.userId = decoded.userId;
            return next();
        }
    });
};

export function AuthFiles(req, res, next){
    const authHeader = req.query.playbackAuth;
    if(!authHeader){
        return res.status(400).json({ "message": "Utilizador não autenticado!" });
    }
    const publicKey = fs.readFileSync('src/keys/publicPlayback.key');
    jwt.verify(authHeader, publicKey, async (err, decoded) => {
        if(err){
            return res.status(403).json({ "message": "Tempo de sessão expirado!" });
        }else{
            req.ringId = decoded.ringId;
            return next();
        }
    });
};