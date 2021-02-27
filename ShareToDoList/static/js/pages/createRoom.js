const create = document.querySelector(".js-create"),
    form = document.querySelector(".js-form");

let createtitle = "origin";

function wantCreate(event){
    event.preventDefault();
    const input = document.createElement("input");
    input.placeholder = "create new room";
    form.appendChild(input);
    create.disabled = true;
    console.log(event);
    form.addEventListener("submit",createRoom);
}

function createRoom(event){
    event.preventDefault();
    console.log(event);
    const title = document.querySelector("input").value;
    sendDB(title);
    form.removeChild(document.querySelector("input"));
    create.disabled = false;
    // add to room list
    // sendDB(currentValue);
}

function sendDB(text){
    const newroom = {
        title : text
    };
    console.log(newroom);
//    host = localStorage.id?
//    title = text
}


function init(){
    create.addEventListener("click",wantCreate)
}
init();