import {User} from './model';
import {Utilities} from './utilities'

let user;
let util = new Utilities();

const tbody = document.querySelector('.table tbody');
const paginEl = document.querySelector('.pagin');
const form = document.getElementById('formularz');
const slider = document.querySelector('.slidecontainer');
const sliderVal = document.getElementById('slidecontainerval');
const inputElements = document.querySelectorAll('#formularz input');

let pageData = {
    currentPage: 0,
    elementsPerPage: 5
}

form.addEventListener('submit', (ev) => {
    postUser().then(() => {
        showUsers();
        util.generateSlider(slider, sliderVal, pageData, showUsers);
    })
    event.preventDefault();
})

let showUsers = function (): Promise<any> {
    return Promise.all([
        User.getUsersCounter(),
        User.getUsersPerPage({currentPage: pageData.currentPage, elementsPerPage: pageData.elementsPerPage})
    ]).then((res) => {
        const counter = res[0];
        const usersArr = res[1].data;
        console.log(usersArr);
        console.log('users Arr :', usersArr);
        util.generateUsersTable(usersArr, tbody, pageData);
        util.generatePagination(counter, paginEl, pageData, showUsers);
    }).catch(err => console.log);
}

let postUser = function(): Promise<any> {
    return new Promise((resolve, reject) => {
        user = new User((<HTMLInputElement>inputElements[0]).value,
            (<HTMLInputElement>inputElements[1]).value,
            parseInt((<HTMLInputElement>inputElements[2]).value),
            (<HTMLInputElement>inputElements[3]).value,
            (<HTMLInputElement>inputElements[4]).value);
        resolve(user.sendUserObject());
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

window.onload = function (event){
    util.generateSlider(slider, sliderVal, pageData, showUsers);
    showUsers();
};



