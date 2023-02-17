/* eslint-disable no-var */
import { ContextInterface } from './context.interface';

declare global {
  var context: ContextInterface; // auth Context
  var commonContext: { [key: string]: ContextInterface };
  var saltRound: number;
}

declare global {
  namespace Express {
    export interface Request {
      headers: {
        token: string;
      },
      authContext?: {
        id: string
      }
    }
  }
}
export {};
