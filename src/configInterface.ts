/**
 * Config Interface
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IConfigInterface {
    name?: string;
    max?: number;
    min?: number;
    refreshIdle?: boolean;
    idleTimeoutMillis?: number;
    reapIntervalMillis?: number;
    returnToHead?: boolean;
    priorityRange?: number;
    validate?: (client: any) => boolean;
    validateAsync?: (client: any, callback: (remove: boolean) => void) => void;
    log?: boolean | ((log: string, level: string) => void);
}
