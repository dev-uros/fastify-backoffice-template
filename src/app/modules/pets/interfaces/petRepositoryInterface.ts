import {Insertable, Selectable, Updateable} from "kysely";
import {Pets} from "kysely-codegen";

export interface PetRepositoryInterface {
    index(): Promise<Selectable<Pets>[]>
    find(petId: number): Promise<Selectable<Pets> | undefined>
    store(petData: Insertable<Pets>): Promise<Selectable<Pets>>
    update(petData: Updateable<Pets>, petId: number): Promise<Selectable<Pets> | undefined>
}