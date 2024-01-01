import * as dotenv from 'dotenv';
dotenv.config();
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './users/routes-config';
import { onUserCreated } from './listeners/createdUserListener';

admin.initializeApp();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app);

export const api = functions.https.onRequest(app);
export { onUserCreated };
