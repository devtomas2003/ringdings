import express from 'express';

import { Auth } from './middlewares/Auth';

import { RingTone, checkCallPerms, saveExtraCall } from './Controllers/Voice';
import { StartSession, charge, enableServices, getTransactions, phoneLines, validateAuth } from './Controllers/Account';
import { buyRingDing, getLineActualRing, listRingDings, myRingDings, signPlayback, updateRingTone } from './Controllers/RingDings';

const routes = express.Router();

routes.get('/callAllowed/:msisdn', checkCallPerms);
routes.get('/ringTone/:msisdn', RingTone);
routes.get('/saveExtraCall/:msisdn/:callStatus', saveExtraCall);
routes.get('/startSession', StartSession);
routes.get('/validateAuth', Auth, validateAuth);
routes.get('/phoneLines', Auth, phoneLines);
routes.get('/activateLine/:phoneLine', Auth, enableServices);
routes.get('/listRingDings', Auth, listRingDings);
routes.get('/myRingDings', Auth, myRingDings);
routes.post('/updateRingTone/:phoneLine', Auth, updateRingTone);
routes.post('/buyRingDing', Auth, buyRingDing);
routes.get('/getLineActualRing/:phoneLine', Auth, getLineActualRing);
routes.get('/getTransactions', Auth, getTransactions);
routes.post('/charge', Auth, charge);
routes.get('/signPlayback/:ringId', Auth, signPlayback);

export default routes;