import fp from "fastify-plugin";

import { UserListServiceInterface } from "../interfaces/UserListServiceInterface";

export default fp(
  async (fastify, opts) => {
    class UserListService implements UserListServiceInterface {
      async getUserList() {
        const userRepository = fastify.getUserRepository();
        return await userRepository.getUserList();
      }
    }

    fastify.decorate(
      "UserListService", new UserListService()
    );
  },
  {
    name: "UserListService",
  }
);

declare module "fastify" {
  export interface FastifyInstance {
    UserListService: UserListServiceInterface
  }
}
