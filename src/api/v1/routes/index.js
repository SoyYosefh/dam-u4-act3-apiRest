import { Router } from 'express';
import config from '../../../config/config';

import prodServ from './pagos.routes';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;
    app.use(api, router);
    
    router.use('/pagos', prodServ);
    
    return router;
};
module.exports = routerAPI;