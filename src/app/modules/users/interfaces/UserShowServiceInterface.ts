import {Selectable} from "kysely/dist/esm/index.js";
import {Users} from "kysely-codegen";

export interface UserShowServiceInterface {
    find(userId: number): Promise<Selectable<Users> | undefined>
}