import {Insertable, Selectable} from "kysely";
import {PasswordResets} from "kysely-codegen";

export interface PasswordResetRepositoryInterface {
    find(id: number, email: string): Promise<Selectable<PasswordResets> | undefined>
    store(data: Insertable<PasswordResets>): Promise<Selectable<PasswordResets>>
    delete(id: number): Promise<Selectable<PasswordResets> | undefined>

}