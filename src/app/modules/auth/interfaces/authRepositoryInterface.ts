import { Selectable} from "kysely";
import { Users} from "kysely-codegen";

export interface AuthRepositoryInterface {
    find(name: string): Promise<Selectable<Users> | undefined>

}