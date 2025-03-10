import {Selectable} from "kysely/dist/esm/index.js";
import {Pets} from "kysely-codegen";

export interface PetIndexServiceInterface {
    getPets(): Promise<Selectable<Pets>[]>
    // find(petId: number): Promise<Selectable<Pets> | undefined>
    // store(petData: Insertable<Pets>): Promise<Selectable<Pets>>
    // update(petData: Updateable<Pets>, petId: number): Promise<Selectable<Pets> | undefined>
}