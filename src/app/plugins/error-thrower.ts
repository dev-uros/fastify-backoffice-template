import fp from 'fastify-plugin'


class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
        Error.captureStackTrace(this, NotFoundError);
    }
}

class ValidationError extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 422;
        Error.captureStackTrace(this, NotFoundError);
    }
}

export default fp(async (fastify, opts) => {

    fastify.decorate('NotFoundError', NotFoundError)

    fastify.decorate('ValidationError', ValidationError)

})


declare module 'fastify' {
    interface FastifyInstance {
        NotFoundError: typeof NotFoundError,
        ValidationError: typeof ValidationError
    }

}
