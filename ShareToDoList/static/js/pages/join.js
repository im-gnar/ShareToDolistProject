const joinbtn = document.querySelectorAll(".joinbtn");
//var rno = document.getElementsByClassName('joinbtn')[0].id;

function sendRno(event){
    console.log(event);
    let rno = event.target.id;
    const data = {
    "rno": rno
    };
    $.ajax({
        url: '/todolist',
        type: 'GET',
        data: JSON.stringify(data),
        dataType: "json"
    }).done(function(result){
        console.log(result)
    });
}
function init(){
    console.log(joinbtn);
    joinbtn.addEventListener("click", sendRno);
}
init();