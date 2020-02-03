import { Worker } from './worker';

export interface Workers {
    [propName: string]: Worker;
}
