import fp from 'fastify-plugin'
import nodemailer, {TransportOptions, Transporter} from 'nodemailer'
import {Selectable} from "kysely";
import {Users} from "kysely-codegen";

interface MailerInterface {
    sendActivateAccountEmail(user: Selectable<Users>, token: string, passwordResetRequestId: number): void
    sendForgotPasswordEmail(user: Selectable<Users>, token: string, passwordResetRequestId: number): void

}
export default fp(async (fastify) => {

    class Mailer implements MailerInterface{
        private transporter: Transporter;

        constructor() {
            this.transporter = this.createTransporter();
        }

        private createTransporter(): Transporter {
            return nodemailer.createTransport({
                host: fastify.config.MAIL_HOST,
                port: fastify.config.MAIL_PORT,
                secure: fastify.config.MAIL_ENCRYPTION !== 'tls',
                auth: {
                    user: fastify.config.MAIL_USERNAME,
                    pass: fastify.config.MAIL_PASSWORD,
                },
            } as TransportOptions);
        }

        private getDefaultMailOptions() {
            return {
                from: {
                    address: fastify.config.MAIL_FROM_ADDRESS,
                    name: fastify.config.MAIL_FROM_NAME,
                },
            };
        }

        async sendActivateAccountEmail(user: Selectable<Users>, token: string, passwordResetRequestId: number) {
            await this.transporter.sendMail({
                ...this.getDefaultMailOptions(),
                subject: 'Account Activation',
                to: user.email,
                html: await fastify.view('email-activate-account', {
                    userFullName: `${user.first_name} ${user.first_name}`,
                    activateAccountUrl: `${fastify.config.BASE_URL}/auth/activate-account?email=${user.email}&token=${token}&requestId=${passwordResetRequestId}`
                })
            });
        }

        async sendForgotPasswordEmail(user: Selectable<Users>, token: string, passwordResetRequestId: number) {
            await this.transporter.sendMail({
                ...this.getDefaultMailOptions(),
                subject: 'Forgot Password',
                to: user.email,
                html: await fastify.view('email-forgot-password', {
                    userFullName: `${user.first_name} ${user.first_name}`,
                    activateAccountUrl: `${fastify.config.BASE_URL}/auth/reset-password?email=${user.email}&token=${token}&requestId=${passwordResetRequestId}`
                })
            });
        }
    }


    fastify.decorate('Mailer', new Mailer());
}, {
    name: 'mail',
    dependencies: ['config', 'view']
});


declare module 'fastify' {
    export interface FastifyInstance {
        Mailer: MailerInterface
    }
}