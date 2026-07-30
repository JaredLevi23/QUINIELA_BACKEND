import { User } from "../../auth/interfaces/user.interface";

export interface UserResponse {
    msg: string;
    user: User;
}
