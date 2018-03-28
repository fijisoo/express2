export interface userModel {
    name: string;
    surname: string;
    age: number;
    login:string;
    pass:string;

    sendUserObject():{name: string,
        surname: string,
        age: number,
        login:string,
        pass:string
    }
}

export class User implements userModel{
    name;
    surname;
    age;
    login;
    pass;

    constructor(name: string, surname: string, age: number, login:string, pass:string){
        this.name = name;
        this.surname = surname;
        this.age = age;
        this.login = login;
        this.pass = pass;
    }

    sendUserObject(){
        return{
            name: this.name,
            surname: this.surname,
            age: this.age,
            login: this.login,
            pass: this.pass
        }
    }

    static getUsersCounter (): Promise<any>{
        return fetch('/usersCounter')
            .then(response => response.json()
                .then((data)=>{
                    return data;
                }))
            .catch(err => console.log);
    }

    static getUsersPerPage (obj:{currentPage: number, elementsPerPage: number}): Promise<any>{
        obj.elementsPerPage = Math.max(1, obj.elementsPerPage);

        let firstSemafor = obj.elementsPerPage * obj.currentPage;
        let secondSemafor = obj.elementsPerPage + obj.elementsPerPage * obj.currentPage;

        return fetch(`/getUsers?firstSemafor=${firstSemafor}&secondSemafor=${secondSemafor}`)
            .then(response => response.json()
                .then(data => {return{response, data}}))
            .catch(err => console.log);
    }

}

