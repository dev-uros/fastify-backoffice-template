import fp from "fastify-plugin";
import {Job, Worker} from "bullmq";
import {Selectable} from "kysely";
import {Users} from "kysely-codegen";

export default fp(
    async (fastify, opts) => {

        const worker = new Worker(
            'userForgotPasswordEmailQueue',
            async (job: Job<{user: Selectable<Users>, token: string, passwordResetRequestId: number}>) => {
                // Will print { foo: 'bar'} for the first job
                // and { qux: 'baz' } for the second.
                await fastify.Mailer.sendForgotPasswordEmail(job.data.user, job.data.token, job.data.passwordResetRequestId)

            },
            { connection: fastify.redis['redisQueue'] },
        );


        worker.on('completed', (job: Job, returnvalue: any) => {
            fastify.log.info(`${job.name} completed`)
            fastify.log.info(`${job.data.user.email} - email sent`)
        });


        worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
            if(job){
                fastify.log.warn(`${job.name} failed`)
                fastify.log.warn(`${job.data.user.email} - email sent`)
            }else{
                fastify.log.error(error.message);
            }

        });

        worker.on('error', err => {
            fastify.log.error(err.message)
        })

        fastify.addHook('onClose', async () => {
            await worker.close();
        })
    }, {
        name: 'userForgotPasswordEmailJob',
        dependencies: ['mail', 'redis']
    })