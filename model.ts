export interface userModel {
    addUser(name: string, surname: string, age: number, login:string, pass:string);
}

export class User{
    constructor(){}
    public static addUser(name: string, surname: string, age: number, login:string, pass:string){
        return{
            name: name,
            surname: surname,
            age: age,
            login: login,
            pass: pass
        }
    }

    postUser(name: string, surname: string, age: number, login:string, pass:string): Promise<any> {
        return new Promise((resolve, reject) => {
            let newUser = User.addUser(name, surname, age, login, pass);
            resolve(newUser);
        }).then((data) => {
            return fetch("/addUser", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        });
    }

    getUsersCounter (): Promise<any>{
        return fetch('/usersCounter')
            .then(response => response.json()
                .then((data)=>{
                    return data;
                }))
            .catch(err => console.log);
    }

    getUsersPerPage (obj:{currentPage: number, elementsPerPage: number}): Promise<any>{
        obj.elementsPerPage = Math.max(1, obj.elementsPerPage);

        let firstSemafor = obj.elementsPerPage * obj.currentPage;
        let secondSemafor = obj.elementsPerPage + obj.elementsPerPage * obj.currentPage;

        return fetch(`/getUsers?firstSemafor=${firstSemafor}&secondSemafor=${secondSemafor}`)
            .then(response => response.json()
                .then(data => {return{response, data}}))
            .catch(err => console.log);
    }

}

