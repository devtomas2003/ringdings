import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function checkCallPerms(req: Request, res: Response){
    const msisdn = req.params.msisdn;
    const accountInfo = await prisma.phoneLines.findUnique({
        where: {
            msisdn
        },
        select: {
            Accounts: {
                select: {
                    balance: true
                }
            },
            activated: true,
            extraCall: true
        }
    });
    if(!accountInfo){
        return res.status(200).send('notfound');
    }
    if(!accountInfo.activated){
        return res.status(200).send('notactivated');
    }
    if(accountInfo.Accounts.balance <= 0 && !accountInfo.extraCall){
        return res.status(200).send('extracall');
    }
    if(accountInfo.Accounts.balance <= 0){
        return res.status(200).send('nobalance');
    }
    res.status(200).send('balanceok');
}

export async function saveExtraCall(req: Request, res: Response){
    const msisdn = req.params.msisdn;
    const callStatus = req.params.callStatus;
    if(callStatus !== "ANSWER"){
        return res.status(200).send('ok');
    }
    const accountInfo = await prisma.phoneLines.findUnique({
        where: {
            msisdn
        },
        select: {
            extraCall: true
        }
    });
    if(!accountInfo){
        return res.status(200).send('notfound');
    }
    await prisma.phoneLines.update({
        data: {
            extraCall: true
        },
        where: {
            msisdn
        }
    });
    return res.status(200).send('extraused');
}

export async function RingTone(req: Request, res: Response){
    const sn = req.params.msisdn;
    const msisdn = sn.startsWith("+351") ? sn : "+351" + sn;
    const accountInfo = await prisma.phoneLines.findUnique({
        where: {
            msisdn
        },
        select: {
            RingTonesBuyed: {
                select: {
                    RingTones: {
                        select: {
                            ringId: true
                        }
                    }
                }
            }
        }
    });

    if(!accountInfo){
        return res.status(200).send('default');
    }
    
    res.status(200).send(accountInfo.RingTonesBuyed.RingTones.ringId);
}