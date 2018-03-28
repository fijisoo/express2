import {Utilities} from './utilities';
let utility = new Utilities();

let generatePagination = function (counter, numberOfElements, element, pageData, callback) {
    let buttonCounter = parseInt(counter) / parseInt(numberOfElements);

    utility.removeChildElements(element);

    if (buttonCounter > 2) {
        generateNextBackButtons(element, pageData.currentPage - 1, '<<', buttonCounter, pageData, callback);
    }

    for (let i = 0; i < buttonCounter; i++) {
        let input = document.createElement('input');
        input.type = 'button';
        input.innerText = `${i}`;
        input.value = `${i}`;
        input.addEventListener('click', function (ev) {
            pageData.currentPage = parseInt(this.value);
            callback();
        });
        element.appendChild(input);
    }

    if (buttonCounter > 2) {
        generateNextBackButtons(element, pageData.currentPage + 1, '>>', buttonCounter, pageData, callback);
    }
}

let generateNextBackButtons = function (parent, value, text, buttonCounter, pageData, callback) {
    let input = document.createElement('input');
    input.type = 'button';
    input.innerText = text;
    input.value = text;
    if (value >= 0 && value < buttonCounter) {
        console.log('value: ', value, 'elementsPerPage: ', pageData.elementsPerPage);
        input.addEventListener('click', function (ev) {
            pageData.currentPage = value;
            callback;//showUser();
        });
    } else {
        input.removeEventListener('click', function (ev) {
            pageData.currentPage = value;
            callback;//showUser();
        })
    }
    parent.appendChild(input);
}


let generateSlider = function (sliderEl, sliderVal, user: User, pageData, callback) {
    let input = document.createElement('input');
    utility.removeChildElements(sliderEl);
    input.type = 'range';
    input.min = '1';
    user.getUsersCounter().then((res) => {
        input.max = res;
    });
    input.value = '1';
    input.className = 'slider';
    input.id = 'myRange';
    input.addEventListener('change', function (ev) {
        pageData.elementsPerPage = parseInt(this.value);
        sliderVal.value = this.value;
        callback;
    })
    sliderEl.appendChild(input);
}

let generateUsersTable = function (arr, tBodyElement, pageData, callback) {
    utility.removeChildElements(tBodyElement);
    let lastIndex = pageData.elementsPerPage;
    arr.forEach((obj, index) => {
        const trElement = document.createElement('tr');
        const thElement = document.createElement('th');
        thElement.innerHTML = (parseInt(index) + 1 + (pageData.currentPage * lastIndex)).toString();
        trElement.appendChild(thElement);
        tBodyElement.appendChild(trElement);
        for (let i in obj) {
            const thElement = document.createElement('th');
            thElement.innerHTML = obj[i];
            trElement.appendChild(thElement);
            tBodyElement.appendChild(trElement);
        }
    })
}