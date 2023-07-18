import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import crypto from "crypto";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

interface RequestAuthed extends Request {
    userId?: string;
}

interface RequestAuthedFile extends Request {
    ringId?: string;
}

export async function listRingDings(req: Request, res: Response){
    const musicLists = await prisma.ringTones.findMany();
    res.status(200).json(musicLists);
}

export async function myRingDings(req: RequestAuthed, res: Response){
    const accountId = req.userId;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const rings = await prisma.ringTonesBuyed.findMany({
        where: {
            Accounts: {
                id: accountId
            }
        },
        select: {
            RingTones: {
                select: {
                    ringName: true,
                    ringAuthor: true,
                    ringId: true,
                    coverPath: true,
                    filePath: true
                }
            },
            buyedId: true
        }
    });

    res.status(200).json(rings);
}

export async function updateRingTone(req: Request, res: Response){
    const phoneLine = req.params.phoneLine;
    const buyedId = req.body.buyedId;

    if(!phoneLine){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (PhoneLine)!"
        });
    }

    if(!buyedId){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (BuyedId)!"
        });
    }

    const ringBuyed = await prisma.ringTonesBuyed.findUnique({
        where: {
            buyedId
        },
        select: {
            accountId: true
        }
    });

    if(!ringBuyed){
        return res.status(400).json({
            "message": "RingDing não comprado!"
        });
    }

    await prisma.phoneLines.update({
        data: {
            RingTonesBuyed: {
                connect: {
                    buyedId
                }
            }
        },
        where: {
            msisdn: phoneLine
        }
    });

    res.status(200).json({
        "message": "RingDing atualizado com sucesso!"
    });
}

export async function getLineActualRing(req: Request, res: Response){
    const phoneLine = req.params.phoneLine;

    if(!phoneLine){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (PhoneLine)!"
        });
    }

    const ring = await prisma.phoneLines.findUnique({
        where: {
            msisdn: phoneLine
        },
        select: {
            RingTonesBuyed: {
                select: {
                    buyedId: true
                }
            }
        }
    });

    res.status(200).json(ring);
}

export async function buyRingDing(req: RequestAuthed, res: Response){
    const accountId = req.userId;
    const ringId = req.body.ringId;

    if(!accountId){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    if(!ringId){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (RingID)!"
        });
    }

    const accountInfo = await prisma.accounts.findUnique({
        where: {
            id: accountId
        },
        select: {
            balance: true
        }
    });

    if(!accountInfo){
        return res.status(400).json({
            "message": "Ocorreu um erro na etapa de autenticação!"
        });
    }

    const ringData = await prisma.ringTones.findUnique({
        where: {
            ringId
        },
        select: {
            price: true,
            ringName: true,
            ringAuthor: true
        }
    });

    if(!ringData){
        return res.status(400).json({
            "message": "RingDing não encontrado!"
        });
    }

    const newSaldo = accountInfo.balance - ringData.price;

    if(newSaldo <= 0){
        return res.status(400).json({
            "message": "Saldo insuficiente para efetuar esta compra!"
        });
    }

    const buyedId = crypto.randomBytes(20).toString('hex');

    await prisma.ringTonesBuyed.create({
        data: {
            buyedId,
            accountId,
            ringId: ringId
        }
    });

    await prisma.transactions.create({
        data: {
            data: new Date().toISOString(),
            id: crypto.randomBytes(20).toString('hex'),
            name: 'Compra de RingDing (' + ringData.ringName + " - " + ringData.ringAuthor + ")",
            tipoTransacao: 'Debito',
            valor: ringData.price,
            Accounts: {
                connect: {
                    id: accountId
                }
            }
        }
    });

    await prisma.accounts.update({
        data: {
            balance: newSaldo
        },
        where: {
            id: accountId
        }
    });

    res.status(200).json({
        "message": "Compra realizada com sucesso!",
        buyedId
    });
}

export async function playRingDing(req: RequestAuthedFile, res: Response){
    const ringId = req.ringId;

    if(!ringId){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (RingID)!"
        });
    }

    const ringData = await prisma.ringTones.findUnique({
        where: {
            ringId
        },
        select: {
            filePath: true
        }
    });

    if(!ringData){
        return res.status(400).json({
            "message": "RingDing não encontrado!"
        });
    }

    const range = req.headers.range;
    if(range){
        const stat = fs.statSync(path.join(__dirname, '..', '..', 'private', 'musics', ringData.filePath + ".mp3"));
        const fileSize = stat.size;
        const CHUNK_SIZE = 500000;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        const contentLength = end - start + 1;
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'audio/mpeg'
        };
        res.writeHead(206, head);
        const videoStream = fs.createReadStream(path.join(__dirname, '..', '..', 'private', 'musics', ringData.filePath + ".mp3"), { start, end });
        videoStream.pipe(res);
    }else{
        res.status(403).json({message: "403 - Forbidden"});
    }
}

export async function signPlayback(req: Request, res: Response){
    const ringId = req.params.ringId;

    if(!ringId){
        return res.status(400).json({
            "message": "Ocorreu um erro no pedido (RingID)!"
        });
    }

    const ringData = await prisma.ringTones.findUnique({
        where: {
            ringId
        },
        select: {
            price: true
        }
    });

    if(!ringData){
        return res.status(400).json({
            "message": "RingDing não encontrado!"
        });
    }

    const privateKey = fs.readFileSync('src/keys/privatePlayback.key');
    const token = jwt.sign({ ringId }, privateKey, { algorithm: 'RS512', expiresIn: '65s' });

    res.status(200).json({
        "authToken": token
    });
}