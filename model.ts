export interface User {
    name:string;
    surname:string;
    age:number;
    login:string;
    pass:string;
}

export class User implements User{
    constructor(){}
    addUser(name: string, surname: string, age: number, login:string, pass:string){
        return{
            name: name,
            surname: surname,
            age: age,
            login: login,
            pass: pass
        }
    }
}

