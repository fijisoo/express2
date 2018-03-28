import {User} from './model';
import {Utilities} from './utilities'

let user = new User();
let util = new Utilities();

const tbody = document.querySelector('.table tbody');
const paginEl = document.querySelector('.pagin');
const form = document.getElementById('formularz');
const slider = document.querySelector('.slidecontainer');
let sliderVal = document.getElementById('slidecontainerval');

let pageData = {
    currentPage: 0,
    elementsPerPage: 5
}

form.addEventListener('submit', (ev) => {
    let inputElements = document.querySelectorAll('#formularz input');
    user.postUser((<HTMLInputElement>inputElements[0]).value,
        (<HTMLInputElement>inputElements[1]).value,
        parseInt((<HTMLInputElement>inputElements[2]).value),
        (<HTMLInputElement>inputElements[3]).value,
        (<HTMLInputElement>inputElements[4]).value
    ).then(() => {
        showUsers();
        util.generateSlider(slider, sliderVal, user, pageData, showUsers);
    })
    event.preventDefault();
})

let showUsers = function (): Promise<any> {
    return Promise.all([
        user.getUsersCounter(),
        user.getUsersPerPage({currentPage: pageData.currentPage, elementsPerPage: pageData.elementsPerPage})
    ]).then((res) => {
        const counter = res[0];
        const usersArr = res[1].data;
        console.log('users Arr :', usersArr);
        util.generateUsersTable(usersArr, tbody, pageData);
        util.generatePagination(counter, paginEl, pageData, showUsers);
    }).catch(err => console.log);
}


window.onload = function (event){
    util.generateSlider(slider, sliderVal, user, pageData, showUsers);
    showUsers();
};



