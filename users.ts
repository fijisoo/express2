import {User} from './model';
import {Utilities} from './utilities'

let user = new User();
let utility = new Utilities();

const tbody = document.querySelector('.table tbody');
const paginEl = document.querySelector('.pagin');
const form = document.getElementById('formularz');
const slider = document.querySelector('.slidecontainer');
let sliderVal = document.getElementById('slidecontainerval');

let pageData = {
    currentPage: 0,
    elementsPerPage: 5
}

let currentPage = 0;
let elementsPerPage = 5;

form.addEventListener('submit', (ev) => {
    let inputElements = document.querySelectorAll('#formularz input');
    user.postUser((<HTMLInputElement>inputElements[0]).value,
        (<HTMLInputElement>inputElements[1]).value,
        parseInt((<HTMLInputElement>inputElements[2]).value),
        (<HTMLInputElement>inputElements[3]).value,
        (<HTMLInputElement>inputElements[4]).value
    ).then(() => {
        showUsers();
        generateSlider();
    })
    event.preventDefault();
})




let showUsers = function (): Promise<any> {
    return Promise.all([
        user.getUsersCounter(),
        user.getUsersPerPage(currentPage, elementsPerPage)
    ]).then((res) => {
        const counter = res[0];
        const usersArr = res[1].data;
        console.log('users Arr :', usersArr);
        generateUsersTable(usersArr, tbody);
        generatePagination(counter, elementsPerPage, paginEl);
    }).catch(err => console.log);
}

window.onload = generateSlider;
showUsers();
