import {Selectable} from "kysely/dist/esm/index.js";
import {Pets} from "kysely-codegen";

export interface PetShowServiceInterface {
    find(petId: number): Promise<Selectable<Pets> | undefined>
}