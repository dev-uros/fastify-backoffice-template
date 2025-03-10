import {Selectable, Updateable} from "kysely/dist/esm/index.js";
import {Pets} from "kysely-codegen";

export interface PetUpdateServiceInterface {
    update(petData: Updateable<Pets>, petId: number): Promise<Selectable<Pets> | undefined>
}