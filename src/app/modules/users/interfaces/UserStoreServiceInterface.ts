import {Selectable} from "kysely/dist/esm/index.js";
import {Users} from "kysely-codegen";
import {UserStoreRequestSchemaType} from "../schemas/storeSchema";

export interface UserStoreServiceInterface {
    store(userData: UserStoreRequestSchemaType): Promise<Selectable<Users> | undefined>
}