import {User} from './model';

let user = new User();

const tbody = document.querySelector('.table tbody');
const paginEl = document.querySelector('.pagin');
const form = document.getElementById('formularz');
const slider = document.querySelector('.slidecontainer');

let currentPage = 0;
let elementsPerPage = 5;

function removeChildElements(parentEl){
    while (parentEl.firstChild) {
        parentEl.removeChild(parentEl.firstChild);
    }
}

function getUsersCounter (): Promise<any>{
    return fetch('/usersCounter')
        .then(response => response.json()
            .then((data)=>{
                return data;
        }))
        .catch(err => console.log);
}

function getUsersPerPage (pageNumber: number, numberOfElements: number): Promise<any>{
    numberOfElements = Math.max(1, numberOfElements);

    let firstSemafor = numberOfElements * pageNumber;
    let secondSemafor = numberOfElements + numberOfElements * pageNumber;

    return fetch(`/getUsers?firstSemafor=${firstSemafor}&secondSemafor=${secondSemafor}`)
        .then(response => response.json()
            .then(data => {return{response, data}}))
        .catch(err => console.log);
}

let generateUsersTable = function (arr, tBodyElement) {
    removeChildElements(tBodyElement);
    let lastIndex = elementsPerPage;
    arr.forEach((obj, index)=>{
        const trElement = document.createElement('tr');
        const thElement = document.createElement('th');
        thElement.innerHTML = (parseInt(index) + 1 + (currentPage * lastIndex)).toString();
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

let generateSlider = function(){
    let input = document.createElement('input');
    let sliderVal = document.getElementById('slidecontainerval');
    removeChildElements(slider);
    input.type = 'range';
    input.min = '1';
    getUsersCounter().then((res)=>{
        input.max = res;
    });
    input.value = '1';
    input.className = 'slider';
    input.id = 'myRange';
    input.addEventListener('change', function (ev){
        elementsPerPage = parseInt(this.value);
        sliderVal.value = this.value;
        showUsers();
    })
    slider.appendChild(input);
}

window.onload = generateSlider;

let generateNextBackButtons = function(parent, value, text, buttonCounter){
    let input = document.createElement('input');
    input.type = 'button';
    input.innerText = text;
    input.value = text;
    if(value >= 0 && value < buttonCounter){
        console.log('value: ', value, 'elementsPerPage: ', elementsPerPage);
        input.addEventListener('click', function(ev){
            currentPage = value;
            showUsers();
        });
    }else{
        input.removeEventListener('click', function(ev){
            currentPage = value;
            showUsers();
        })
    }
    parent.appendChild(input);
}

let generatePagination = function(counter, numberOfElements, element){
    let buttonCounter = parseInt(counter)/parseInt(numberOfElements);
    removeChildElements(element);

    if(buttonCounter > 2){
        generateNextBackButtons(element, currentPage - 1, '<<', buttonCounter);
    }

    for(let i = 0; i < buttonCounter; i++){
        let input = document.createElement('input');
        input.type = 'button';
        input.innerText = `${i}`;
        input.value = `${i}`;
        input.addEventListener('click', function(ev){
            currentPage = parseInt(this.value);
            showUsers();
        });
        element.appendChild(input);
    }

    if(buttonCounter > 2){
        generateNextBackButtons(element, currentPage + 1, '>>', buttonCounter);
    }
}

let showUsers = function():Promise<any> {
    return Promise.all([
        getUsersCounter(),
        getUsersPerPage(currentPage,elementsPerPage)
    ]).then((res)=>{
        const counter = res[0];
        const usersArr = res[1].data;
        console.log('users Arr :', usersArr);
        generateUsersTable(usersArr, tbody);
        generatePagination(counter, elementsPerPage, paginEl);
    })
}

showUsers().catch(err => console.log);

form.addEventListener('submit',(ev)=>{
    addNewUser().then((response) => {
        console.log(response);
            response.json().then((data) => {
                console.log('tutaj: ', data);
            });
        })
    event.preventDefault();
})

function addNewUser(): Promise<any>{
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
    }).then(()=>{
        showUsers();
        generateSlider();
    });
}