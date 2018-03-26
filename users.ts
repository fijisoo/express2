import {User} from './model';

let user = new User();

let pageNumber = 0;

function getUsersCounter (): Promise<any>{
    return fetch('/getUsers')
        .then(response => response.json()
            .then((data)=>{
                return {response, data};
        }))
        .then((res)=>{
            console.log('response code: ', res.response, 'data: ', res.data);
        })
        .catch(err => console.log);
}

function getUsersPerPage (pageNumber: number, numberOfElements: number):Promise<any>{
    numberOfElements = Math.max(1, numberOfElements);
    let firstSemafor = 1 + numberOfElements * pageNumber;
    let secondSemafor = numberOfElements + numberOfElements * pageNumber;
    return fetch(`/getUsers?firstSemafor=${firstSemafor}&secondSemafor=${secondSemafor}`)
        .then(response => response.json()
            .then(data => {return{response, data}}))
        .catch(err => console.log);
}

function addNewUser (): Promise<any>{
    let inputElements = document.querySelectorAll('#formularz input');
    return new Promise(function (resolve, reject){
        let newUser = user.addUser((<HTMLInputElement>inputElements[0]).value,
            (<HTMLInputElement>inputElements[1]).value,
            parseInt((<HTMLInputElement>inputElements[2]).value),
            (<HTMLInputElement>inputElements[3]).value,
            (<HTMLInputElement>inputElements[4]).value
        );
        resolve(newUser);
    }).then((data)=>{
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

let showUsers = function () {
    return Promise.all([
        getUsersCounter().then((res => res.json()),
        getUsersPerPage(1,1).then((res => res.json())
    ])
}

// let showUsers = function (){
//         let tbody = document.querySelector('.table tbody');
//         while (tbody.firstChild) {
//             tbody.removeChild(tbody.firstChild);
//         }
//         fetch('/getUsers').then((data)=>{
//             data.json().then(function (data){
//                 console.log(JSON.stringify(data));
//                 let paginDiv = document.querySelector('.pagin');
//                 let newP = document.createElement('p');
//                 newP.innerText = '' + data;
//                 paginDiv.appendChild(newP);
//             })
//         })
//
//         fetch(`/getUsers/` + pageNumber).then(function (data){
//             data.json().then(function (data){
//                 data.forEach((obj, index)=>{
//                     const trElement = document.createElement('tr');
//                     const thElement = document.createElement('th');
//                     thElement.innerHTML = index;
//                     trElement.appendChild(thElement);
//                     tbody.appendChild(trElement);
//                     for(let i in obj){
//                         const thElement = document.createElement('th');
//                         thElement.innerHTML = obj[i];
//                         trElement.appendChild(thElement);
//                         tbody.appendChild(trElement);
//                     }
//                 })
//             });
//         })
// };
//
// window.addEventListener("load", showUsers);

let form = document.getElementById('formularz');


// function example(currentPage = 0, elementsPerPage = 10) {
//     elementsPerPage = Math.max(1, elementsPerPage);
//     Promise.all([
//         fetch('/usersCount').then((res => res.json())),
//         fetch('/users?page=' + currentPage + '&elementsPerPage=' + elementsPerPage).then((res => res.json())),
//     ]).then((results) => {
//         const count = results[0];
//         const users = results[1];
//     });
// }

form.addEventListener('submit',(ev)=>{
    addNewUser().then((response) => {
        console.log(response);
            response.json().then((data) => {
                console.log('tutaj: ', data);
            });
        })
    event.preventDefault();
})