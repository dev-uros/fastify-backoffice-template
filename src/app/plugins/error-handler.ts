import {FastifyError} from 'fastify'
import fp from 'fastify-plugin'

export default fp(async (fastify, opts) => {
    fastify.setErrorHandler(function (error, request, reply) {
        // Log error
        this.log.info('TU SAM')
        this.log.info(error.statusCode)
        this.log.info(error.message)
        this.log.info(error)
        let errorObject
        switch (error.statusCode) {
            case 400:
                errorObject = handleBadRequestError(error)
                return reply.code(400).send(errorObject)
            case 401:
                errorObject = handleUnauthenticatedError(error)
                return reply.code(401).send(errorObject)
            case 404:
                errorObject = handleEntityNotFoundError(error)
                return reply.code(404).send(errorObject)
            case 422:
                errorObject = handleValidationError(error)
                return reply.code(422).send(errorObject)
            default:
                errorObject = handleServerError()
                return reply.code(500).send(errorObject)
        }
    })

    function handleBadRequestError(error: FastifyError): {
        errors: {
            input: string
            message: string
        }[]
    } {

        const messageBag: { input: string, message: string }[] = [];

        error.validation?.forEach(error => {
            const params = error.params as Record<string, any>;
            let input;
            if (params.errors[0].params.missingProperty) {
                input = params.errors[0].params.missingProperty
            } else if (params.errors[0].params.type === "object") {
                input = 'request'
            } else {
                input = error.instancePath.replace('/', '')
            }
            messageBag.push({
                input: input,
                message: error.message!
            })
        })

        return {errors: messageBag}

    }

    function handleEntityNotFoundError(error: FastifyError): { message: string } {
        return {
            message: error.message
        }
    }

    function handleValidationError(error: FastifyError): { message: string } {
        return {
            message: error.message
        }
    }

    function handleServerError(): { message: string } {
        return {
            message: 'Server Error'
        }
    }

    function handleUnauthenticatedError(error: FastifyError): { message: string } {
        return {
            message: 'Unauthenticated'
        }
    }
})
