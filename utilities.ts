import {User} from "./model";

export class Utilities{
    constructor(){};

    removeChildElements(parentEl){
        console.log('tajpof', typeof parentEl);
        while (parentEl.firstChild) {
            parentEl.removeChild(parentEl.firstChild);
        }
    }

    generatePagination(counter, element, pageData, callback) {
        let buttonCounter = parseInt(counter) / parseInt(pageData.elementsPerPage);
        this.removeChildElements(element);

        if (buttonCounter > 2) {
            this.generateNextBackButtons(element, pageData.currentPage - 1, '<<', buttonCounter, pageData, callback);
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
            this.generateNextBackButtons(element, pageData.currentPage + 1, '>>', buttonCounter, pageData, callback);
        }
    }

    generateNextBackButtons(parent, value, text, buttonCounter, pageData, callback) {
        let input = document.createElement('input');
        input.type = 'button';
        input.innerText = text;
        input.value = text;
        if (value >= 0 && value < buttonCounter) {
            console.log('value: ', value, 'elementsPerPage: ', pageData.elementsPerPage);
            input.addEventListener('click', function (ev) {
                pageData.currentPage = value;
                callback();//showUser();
            });
        } else {
            input.removeEventListener('click', function (ev) {
                pageData.currentPage = value;
                callback();//showUser();
            })
        }
        parent.appendChild(input);
    }

    generateSlider(sliderEl, sliderVal, pageData, callback) {
        let input = document.createElement('input');
        this.removeChildElements(sliderEl);
        input.type = 'range';
        input.min = '1';
        User.getUsersCounter().then((res) => {
            input.max = res;
        });
        input.value = '1';
        input.className = 'slider';
        input.id = 'myRange';
        input.addEventListener('change', function (ev) {
            pageData.elementsPerPage = parseInt(this.value);
            sliderVal.value = this.value;
            callback();
        })
        sliderEl.appendChild(input);
    }

    generateUsersTable(arr, tBodyElement, pageData) {
        this.removeChildElements(tBodyElement);
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

}