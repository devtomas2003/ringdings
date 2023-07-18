import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";

interface RequestAuthed extends Request {
    userId?: string;
}

export async function StartSession(req: Request, res: Response){
    const auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(auth, 'base64').toString().split(':');
    
    if(!username || !password){
        return res.setHeader('WWW-Authenticate', 'Basic realm="SpaceLabs Account"').status(401).send();
    }

    if(username.length < 5 || !username.includes("@")){
        return res.status(400).json({
            "message": "O Utilizador não é válido!"
        });
    }

    if(password.length < 8){
        return res.status(400).json({
            "message": "A Password não é válida!"
        });
    }

    const userData = await prisma.accounts.findUnique({
        where: {
            email: username
        },
        select: {
            password: true,
            id: true
        }
    });

    if(!userData){
        return res.status(404).json({
            "message": "Utilizador não encontrado!"
        });
    }

    const matchPass = await bcrypt.compare(password, userData.password);

    if(!matchPass){
        return res.status(404).json({
            "message": "Utilizador não encontrado!"
        });
    }

    const privateKey = fs.readFileSync('src/keys/private.key');
    const token = jwt.sign({ userId: userData.id }, privateKey, { algorithm: 'RS512', expiresIn: '1h' });

    res.status(200).json({
        "authToken": token
    });
}

export async function validateAuth(req: RequestAuthed, res: Response){
    const accountId = req.userId;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const userData = await prisma.accounts.findUnique({
        where: {
            id: accountId
        },
        select: {
            balance: true,
            name: true
        }
    });
    
    if(!userData){
        return res.status(400).json({
            "message": "Ocorreu um erro, conta não encontrada!"
        });
    }

    res.status(200).json(userData);
}

export async function phoneLines(req: RequestAuthed, res: Response){
    const accountId = req.userId;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const linesInfo = await prisma.accounts.findUnique({
        where: {
            id: accountId
        },
        select: {
            PhoneLines: {
                select: {
                    msisdn: true,
                    activated: true
                }
            }
        }
    });
    
    if(!linesInfo){
        return res.status(400).json({
            "message": "Ocorreu um erro, conta não encontrada!"
        });
    }

    res.status(200).json(linesInfo);
}

export async function enableServices(req: RequestAuthed, res: Response){
    const phoneLine = req.params.phoneLine;
    const accountId = req.userId;

    if(!phoneLine){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido!"
        });
    }

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const checkOwner = await prisma.phoneLines.findUnique({
        where: {
            msisdn: phoneLine
        },
        select: {
            accountId: true
        }
    });

    if(!checkOwner){
        return res.status(400).json({
            "message": "O numero não existe!"
        });
    }

    if(accountId !== checkOwner.accountId){
        return res.status(400).json({
            "message": "A numero não está associado com esta conta!"
        });
    }
    
    await prisma.phoneLines.update({
        where: {
            msisdn: phoneLine
        },
        data: {
            activated: true
        }
    });
    
    res.status(200).json({
        "message": "Linha ativada com sucesso!"
    });
}

export async function charge(req: RequestAuthed, res: Response){
    const accountId = req.userId;
    const balance = req.body.balance;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    if(!balance){
        return res.status(400).json({
            "message": "O Valor para carregamento está em falta!"
        });
    }

    const accountData = await prisma.accounts.findUnique({
        where: {
            id: accountId
        },
        select: {
            balance: true
        }
    });
    
    if(!accountData){
        return res.status(400).json({
            "message": "Ocorreu um erro, conta não encontrada!"
        });
    }
    
    const nextBalance = accountData.balance + parseFloat(balance);

    await prisma.accounts.update({
        data: {
            balance: nextBalance
        },
        where: {
            id: accountId
        }
    });

    if(accountData.balance <= 0 && nextBalance > 0){
        await prisma.phoneLines.updateMany({
            data: {
                extraCall: false
            },
            where: {
                accountId
            }
        });
    }

    await prisma.transactions.create({
        data: {
            data: new Date().toISOString(),
            id: crypto.randomBytes(20).toString('hex'),
            name: "Carregamento",
            tipoTransacao: "Credito",
            valor: parseFloat(balance),
            userId: accountId
        }
    });

    res.status(200).json({
        message: "Carregamento realizado com sucesso!"
    });
}

export async function getTransactions(req: RequestAuthed, res: Response){
    const accountId = req.userId;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const transactions = await prisma.transactions.findMany({
        where: {
            userId: accountId
        },
        select: {
            data: true,
            name: true,
            tipoTransacao: true,
            id: true,
            valor: true
        }
    });

    if(!transactions || transactions.length === 0) {
        return res.status(404).json({
            message: 'Não existem transações na sua conta atualmente!'
        });
    }

    const headers = "id,data,nome,tipoTransacao,valor\n";

    const body = transactions.map((transaction) => {
        return transaction.id + "," + transaction.data + "," + transaction.name + "," + transaction.tipoTransacao + "," + transaction.valor + "\n";
    });

    res.status(200).send(headers + body.join(''));
}