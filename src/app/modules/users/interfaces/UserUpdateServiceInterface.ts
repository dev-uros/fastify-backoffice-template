import {Selectable} from "kysely/dist/esm/index.js";
import {Users} from "kysely-codegen";
import {Updateable} from "kysely";

export interface UserUpdateServiceInterface {
    update(userData: Updateable<Users>, userId: number): Promise<Selectable<Users> | undefined>
}