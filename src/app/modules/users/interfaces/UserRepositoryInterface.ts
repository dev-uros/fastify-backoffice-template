import {Insertable, Selectable, Updateable} from "kysely";
import {Users} from "kysely-codegen";

export interface UserRepositoryInterface {
    getUserList(): Promise<Selectable<Users>[]>
    find(userId: number): Promise<Selectable<Users> | undefined>
    update(userData: Updateable<Users>, userId: number): Promise<Selectable<Users> | undefined>
    findByEmailIgnoringUserId(email: string, userId: number): Promise<Selectable<Users> | undefined>
    findByEmail(email: string): Promise<Selectable<Users>>
    findActiveByEmail(email: string): Promise<Selectable<Users> | undefined>
    findInactiveByEmail(email: string): Promise<Selectable<Users> | undefined>
    store(userData: Insertable<Users>): Promise<Selectable<Users>>
    updateUserPassword(email: string, password: string): Promise<void>
}