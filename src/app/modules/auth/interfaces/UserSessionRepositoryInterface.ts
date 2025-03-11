import {Insertable, Selectable} from "kysely";
import {UserSessions} from "kysely-codegen";

export interface UserSessionRepositoryInterface {
    store(data: Insertable<UserSessions>): Promise<Selectable<UserSessions>>
}