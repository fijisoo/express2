import {User} from './model';

let user = new User();

let pageNumber = 0;

function getUsersCounter (): Promise<any>{
    return fetch('/usersCounter')
        .then(response => response.json()
            .then((data)=>{
                return data;
        }))
        .catch(err => console.log);
}

function getUsersPerPage (pageNumber: number, numberOfElements: number){
    numberOfElements = Math.max(1, numberOfElements);
    // pageNumber = Math.max(1, pageNumber);
    let firstSemafor = numberOfElements * pageNumber;
    let secondSemafor = numberOfElements + numberOfElements * pageNumber;
    console.log('firstSemafor: ', firstSemafor, 'secondSemafor: ', secondSemafor);
    return fetch(`/getUsers?firstSemafor=${firstSemafor}&secondSemafor=${secondSemafor}`)
        .then(response => response.json()
            .then(data => {return{response, data}}))
        .catch(err => console.log);
}


let generateUsersTable = function (arr, tBodyElement) {
    while (tBodyElement.firstChild) {
        tBodyElement.removeChild(tBodyElement.firstChild);
    }
    arr.forEach((obj, index)=>{
        const trElement = document.createElement('tr');
        const thElement = document.createElement('th');
        thElement.innerHTML = index;
        trElement.appendChild(thElement);
        tBodyElement.appendChild(trElement);
        for(let i in obj){
            const thElement = document.createElement('th');
            thElement.innerHTML = obj[i];
            trElement.appendChild(thElement);
            tbody.appendChild(trElement);
        }
    })
}

let generatePagination = function (counter, numberOfElements, element){
    let buttonCounter = parseInt(counter)/parseInt(numberOfElements);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    for(let i = 0; i < buttonCounter; i++){
        let input = document.createElement('input');
        input.type = 'button';
        input.innerText = `${i}`;
        input.value = `${i}`;
        input.addEventListener('click', function(ev){
            showUsers(this.value, 4);
        } )
        element.appendChild(input);
    }
}

let tbody = document.querySelector('.table tbody');
let paginEl = document.querySelector('.pagin');

let showUsers = function (pageNumber, numberOfElements) {
    return Promise.all([
        getUsersCounter(),
        getUsersPerPage(pageNumber,numberOfElements)
    ]).then((res)=>{
        const counter = res[0];
        const usersArr = res[1].data;
        console.log('users Arr :', usersArr);
        generateUsersTable(usersArr, tbody);
        generatePagination(counter, numberOfElements, paginEl);
    })
}
showUsers(0, 4);

let form = document.getElementById('formularz');

form.addEventListener('submit',(ev)=>{
    addNewUser().then((response) => {
        console.log(response);
            response.json().then((data) => {
                console.log('tutaj: ', data);
            });
        })
    event.preventDefault();
})


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
    }).then((res)=>{
        showUsers(0, 4);
    });

}