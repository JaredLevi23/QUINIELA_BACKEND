export interface User {
    name : string;
    lastname: string;
    email: string;
    role: string;
    enabled: boolean;
    google: boolean;
    uid: string;
}


// {
//     "user": {
//         "name": "Jared Levi",
//         "lastname": "Gonzalez",
//         "email": "example@algo.com",
//         "role": 0,
//         "enabled": true,
//         "google": false,
//         "uid": "69843c3b38476b2ff7e8d94c"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2OTg0M2MzYjM4NDc2YjJmZjdlOGQ5NGMiLCJpYXQiOjE3NzA1MTIzNTR9.FVtz07muoNEuhAc2yqQW1EBZZPL34EBPW4dAdNITkyU"
// }