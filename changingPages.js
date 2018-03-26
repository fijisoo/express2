let listBtn = document.querySelector('.nav-buttons.list-btn');
let formBtn = document.querySelector('.nav-buttons.form-btn');

let listBool = true;
let formBool = true;

listBtn.addEventListener('click', (el)=>{
    let listContent = document.querySelector('.list');
    if(listBool){
        listBool = false;
        listContent.style.display = 'none';
    }else{
        listBool = true;
        listContent.style.display = 'flex';
    }
})

formBtn.addEventListener('click', (el)=>{
    let formContent = document.querySelector('.form');
    if(formBool){
        formBool = false;
        formContent.style.display = 'none';
    }else{
        formBool = true;
        formContent.style.display = 'flex';
    }
})

