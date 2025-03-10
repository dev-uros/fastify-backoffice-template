import fp from "fastify-plugin";
import {Queue} from "bullmq";
import {Selectable} from "kysely";
import {Users} from "kysely-codegen";

export default fp(
    async (fastify, opts) => {
        const userAccountActivationEmailQueue = new Queue(
            'userAccountActivationEmailQueue',
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

        userAccountActivationEmailQueue.on('error', (err) => {
            fastify.log.error('queue error:' + err.message);
        })
        const addJob = async(user: Selectable<Users>, token: string, passwordResetRequestId: number) => {
            await userAccountActivationEmailQueue.add(
                'sendActivateAccountEmailToUser',
                {user, token, passwordResetRequestId},
                { removeOnComplete: 100, removeOnFail: 500 })
        }

        fastify.addHook('onClose', async () => {
            await userAccountActivationEmailQueue.close();
        })


        fastify.decorate('sendActivateAccountEmailToUser', addJob)

    },{
        name: 'userAccountActivationEmailQueue',
        dependencies: ['redis']
    });


declare module 'fastify' {
    export interface FastifyInstance {
        sendActivateAccountEmailToUser(user: Selectable<Users>, token: string, passwordResetRequestId: number): Promise<void>
    }
}
