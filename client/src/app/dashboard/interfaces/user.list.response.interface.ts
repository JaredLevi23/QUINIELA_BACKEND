import { User } from "../../auth/interfaces/user.interface";

export interface UserListResponse {
    msg: string;
    total: number;
    page: number;
    limit: number;
    users: User[];
}
