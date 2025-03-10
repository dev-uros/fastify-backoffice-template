import {Selectable} from "kysely/dist/esm/index.js";
import {Users} from "kysely-codegen";

export interface UserListServiceInterface {
    getUserList(): Promise<Selectable<Users>[]>
    // find(petId: number): Promise<Selectable<Pets> | undefined>
    // store(petData: Insertable<Pets>): Promise<Selectable<Pets>>
    // update(petData: Updateable<Pets>, petId: number): Promise<Selectable<Pets> | undefined>
}