/**
 * Config Interface
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IConfigInterface {
    url: string;
    mongoOptions?: {
        uri_decode_auth?: boolean;
        db?: any;
        server?: any;
        replSet?: any;
        mongos?: any;
        promiseLibrary?: any;
    };
    poolOptions?: {
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
    };
}
