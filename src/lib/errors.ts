export class RouteError extends Error {
    readonly route: string;

    constructor(message: string, route: string, options?: { cause?: unknown }) {
        super(message, options)
        this.route = route;

    }

    makeResponse(status: number, kwargs: Record<string, any> = {}, headers: HeadersInit | undefined = undefined): Response {
        const responseMetadata : ResponseInit = {
            status,
            statusText: this.name,
        }

        if(headers) responseMetadata.headers = headers;
        return new Response(JSON.stringify({
            status: "failed",
            route: this.route,
            reason: this.message,
            ...kwargs
        }), responseMetadata);
    }

    static fromBaseError(baseError: unknown, route: string): RouteError {
        const err = new RouteError(
            baseError instanceof Error ? baseError.message : "an unknown error occured",
            route,
            { cause: baseError }
        )
        err.name = baseError instanceof Error ? baseError.name : "UnknownError";

        //logging
        console.log(`Error in route ${route}:`, err);
        if (baseError instanceof Error) console.error(baseError);
        

        return err;
    }
}

export class BadRequestError extends RouteError {
    constructor(message: string, route: string, options?: { cause?: unknown }) {
        super(message, route, options);
        this.name = "BadRequestError";
    }
}

export class AuthenticationError extends RouteError {
    constructor(message: string, route: string, options?: { cause?: unknown }) {
        super(message, route, options);
        this.name = "AuthenticationError";
    }
}

export class AuthorizationError extends RouteError {
    constructor(message: string, route: string, options?: { cause?: unknown }) {
        super(message, route, options);
        this.name = "AuthorizationError";
    }
}

export class NotFoundError extends RouteError {
    constructor(message: string, route: string, options?: { cause?: unknown }) {
        super(message, route, options);
        this.name = "NotFoundError";
    }
}

export function handleError(error: RouteError): Response {
    switch (error.name) {
        case "AuthenticationError":
            return error.makeResponse(401)
        case "AuthorizationError":
            return error.makeResponse(403)
        case "BadRequestError":
            return error.makeResponse(400)
        case "NotFoundError":
            return error.makeResponse(404)
        default:
            return error.makeResponse(500)
    }
}

export function ERRLOG(message: string, route?: string) {
    console.error(`${new Date().toISOString()} [ERROR]: ${message}`);
}

export function INFOLOG(message: string, route?: string) {
    console.log(`${new Date().toISOString()} [INFO]: ${message}`);
}

export function DEBUGLOG(message: string, route?: string) {
    if (process.env.DEBUG === "true") {
        console.log(`${new Date().toISOString()} [DEBUG]: ${message}`);
    }
}

export function WARNLOG(message: string, route?: string) {
    console.warn(`${new Date().toISOString()} [WARN]: ${message}`);
}

export function CRITLOG(message: string, route?: string) {
    console.error(`${new Date().toISOString()} [CRITICAL]: ${message}`);
}