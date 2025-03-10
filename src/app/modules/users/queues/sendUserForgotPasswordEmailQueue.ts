import fp from "fastify-plugin";
import {Queue} from "bullmq";
import {Selectable} from "kysely";
import {Users} from "kysely-codegen";

export default fp(
    async (fastify, opts) => {
        const userForgotPasswordEmailQueue = new Queue(
            'userForgotPasswordEmailQueue',
            {
                connection: fastify.redis['redisQueue'],
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 5000
                    }
                }
            }
        );

        userForgotPasswordEmailQueue.on('error', (err) => {
            fastify.log.error('queue error:' + err.message);
        })
        const addJob = async(user: Selectable<Users>, token: string, passwordResetRequestId: number) => {
            await userForgotPasswordEmailQueue.add(
                'sendUserForgotPasswordEmailToUser',
                {user, token, passwordResetRequestId},
                { removeOnComplete: 100, removeOnFail: 500 })
        }

        fastify.addHook('onClose', async () => {
            await userForgotPasswordEmailQueue.close();
        })


        fastify.decorate('sendUserForgotPasswordEmailToUser', addJob)

    },{
        name: 'userForgotPasswordEmailQueue',
        dependencies: ['redis']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        sendUserForgotPasswordEmailToUser(user: Selectable<Users>, token: string, passwordResetRequestId: number): Promise<void>
    }
}
