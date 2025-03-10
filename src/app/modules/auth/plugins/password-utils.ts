import fp from "fastify-plugin";
import bcrypt from "bcrypt";
import {nanoid} from "nanoid";

export default fp(
    async (fastify, opts) => {
        const saltRounds = 10;

        const generateToken = () => {
            return nanoid(32);
        }

        const generatePasswordObject = async () => {
            const plainTextPassword = generateToken();
            return {
                plainTextPassword,
                hashedPassword: await bcrypt.hash(plainTextPassword, saltRounds)
            }
        }

        const verifyPassword = async (plainTextPassword: string, hashedPassword: string) => {
            return await bcrypt.compare(plainTextPassword, hashedPassword);
        }

        const hashPassword = async(plainTextPassword: string) => {
            return await bcrypt.hash(plainTextPassword, saltRounds)
        }

        fastify.decorate('generatePasswordObject', generatePasswordObject);
        fastify.decorate('verifyPassword', verifyPassword);
        fastify.decorate('generateToken', generateToken )
        fastify.decorate('hashPassword', hashPassword )


    }, {
        name: 'passwordUtils',
        dependencies: ['config']
    })


declare module 'fastify' {
    interface FastifyInstance {
        generateToken(): string,
        generatePasswordObject(): Promise<{plainTextPassword: string, hashedPassword:string}>,
        verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>,
        hashPassword(plainTextPassword: string): Promise<string>

    }

}