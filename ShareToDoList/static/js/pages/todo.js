const toDoForm = document.querySelector(".js-toDoForm"),
	toDoInput = toDoForm.querySelector(".js-toDoInput"),
	toDoList = document.querySelector(".js-toDoList"),
	toDoProgressBar = document.querySelector(".js-toDoProgressBar"),
	completed = document.querySelector(".js-completed"),
	empty = toDoForm.querySelector(".js-empty"),
	nothing = document.querySelector(".js-nothing");

const TODOS_LS = "toDos";
const SHOWING_CN = "showing";

let toDos = [];
let checkedNum = 0;
let previousPercent = 0;

function deleteNothing(){
	nothing.classList.remove(SHOWING_CN);
}

function paintNothing(){
	nothing.classList.add(SHOWING_CN);
}

function saveToDos(){
	localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
	deleteNothing();
}

function editToDo(event){
	event.preventDefault();
	let editForm;
	if(event.target.className === "submitBtn"){
		const submitBtn = event.target;
		const editBtnspan = submitBtn.parentNode;
		editForm = editBtnspan.parentNode;
	} else {
		editForm = event.target;
	}
	const editInput = editForm.querySelector(".editInput");
	const empty = editForm.querySelector(".empty");
	const text = editInput.value;
	if(text === ""){
		//nothing written
		empty.classList.add(SHOWING_CN);
	} else {
		//show edited to do list
		empty.classList.remove(SHOWING_CN);
		const li = editForm.parentNode;
		editForm.removeChild(editInput);
		li.removeChild(editForm);
		const label = document.createElement("label");
		const checkBox = document.createElement("input");
		checkBox.setAttribute("type", "checkbox");
		checkBox.setAttribute("class", "todoCheck");
		const span = document.createElement("span");
		span.setAttribute("class", "content");
		const btnSpan = document.createElement("span");
		btnSpan.setAttribute("class", "controlBtns");
		const editBtn = document.createElement("img");
		editBtn.setAttribute("class", "editBtn");
		editBtn.src = "../../../templates/ShareToDoList/templates/static/images/edit.png";
		const delBtn = document.createElement("img");
		delBtn.setAttribute("class", "delBtn");
		delBtn.src = "../../../templates/ShareToDoList/templates/static/images/delete.png";
		checkBox.addEventListener("change", checkBoxChange);
		editBtn.innerText = "edit";
		editBtn.addEventListener("click", showEdit);
		delBtn.innerText = "delete";
		delBtn.addEventListener("click", deleteToDo);
		span.innerText = `${text}`;
		li.appendChild(label);
		label.appendChild(checkBox);
		label.appendChild(span);
		li.appendChild(btnSpan);
		btnSpan.appendChild(editBtn);
		btnSpan.appendChild(delBtn);
		//저장
		for(var i = 0; i < toDos.length; i++){
			if(toDos[i].id === parseInt(li.id)){
				toDos[i].text = text;
			};
		}
		saveToDos();
	}
}

//edit undo
function undo(event){
	//hide editForm
	//li > form > input, editBtns(undoBtn, submitBtn), editEmpty
	const undoBtn = event.target;
	const editBtns = undoBtn.parentNode;
	const editForm = editBtns.parentNode;
	const li = editForm.parentNode;
	const editInput = editForm.querySelector(".editInput");
	const editEmpty = editForm.querySelector(".empty");
	editEmpty.classList.remove(SHOWING_CN);
	li.removeChild(editForm);
	//show to do list (label, btns)
	//li > label > input(checkbox), span(content)
	const label = document.createElement("label");
	const checkBox = document.createElement("input");
	checkBox.setAttribute("type", "checkbox");
	checkBox.setAttribute("class", "todoCheck");
	const content = document.createElement("span");
	content.setAttribute("class", "content");
	//li > span(btns) > img(editBtn), img(delBtn)
	const btns = document.createElement("span");
	btns.setAttribute("class", "controlBtns");
	const editBtn = document.createElement("img");
	editBtn.setAttribute("class", "editBtn");
	editBtn.src = "images/edit.png";
	const delBtn = document.createElement("img");
	delBtn.setAttribute("class", "delBtn");
	delBtn.src = "images/delete.png";
	//eventListener(checkbox, edit, delete)
	checkBox.addEventListener("change", checkBoxChange);
	editBtn.addEventListener("click", showEdit);
	delBtn.addEventListener("click", deleteToDo);
	for(var i = 0; i < toDos.length; i++){
		if(toDos[i].id === parseInt(li.id)){
			console.log(toDos[i].id);
			console.log(li.id);
			console.log(toDos[i].text);
			checkBox.checked = toDos[i].isChecked;
			const text = toDos[i].text;
			content.innerText = `${text}`;
		};
	}
	li.appendChild(label);
	label.appendChild(checkBox);
	label.appendChild(content);
	li.appendChild(btns);
	btns.appendChild(editBtn);
	btns.appendChild(delBtn);
}

function showEdit(event){
	//hide to do list (label, btns)
	//li > label(checkbox, content), btns(editBtn, delBtn)
	const editBtn = event.target;
	const btns = editBtn.parentNode;
	const li = btns.parentNode;
	const label = li.querySelector("label");
	const content = li.querySelector(".content");
	li.removeChild(label);
	li.removeChild(btns);
	//show editForm
	//form > input, editBtns(undoBtn, submitBtn), editEmpty
	const editForm = document.createElement("form");
	const editInput = document.createElement("input");
	editInput.setAttribute("type", "text");
	editInput.setAttribute("class", "editInput");
	editInput.setAttribute("placeholder", "EDIT YOUR TO DO!");
	editInput.setAttribute("value", content.innerText);
	const editBtns = document.createElement("span");
	editBtns.setAttribute("class", "controlBtns");
	const undoBtn = document.createElement("img");
	undoBtn.setAttribute("class", "undoBtn");
	undoBtn.src = "images/undo.png";
	const submitBtn = document.createElement("img");
	submitBtn.setAttribute("class", "submitBtn");
	submitBtn.src = "images/submit.png";
	const editEmpty = document.createElement("div");
	editEmpty.setAttribute("class", "empty");
	editEmpty.innerText = "You can't leave this empty."
	li.appendChild(editForm);
	editForm.appendChild(editInput);
	editForm.appendChild(editBtns);
	editBtns.appendChild(undoBtn);
	editBtns.appendChild(submitBtn);
	//eventListener(undo, submitBtn, submitEnter)
	undoBtn.addEventListener("click", undo);
	submitBtn.addEventListener("click", editToDo);
	editForm.appendChild(editEmpty);
	editForm.addEventListener("submit", editToDo);
}

function paintProgressBar(checkedNum){
	let percent = 0;
	//퍼센트 계산: 체크 수 / to do 수 * 100 반올림
	if(toDos.length != 0) {
		percent = Math.round(checkedNum / toDos.length * 100);
	}
	//(처음)넓이: 이전 퍼센트
	let width = previousPercent;
	//퍼센트 증가
	if(percent >= previousPercent){
		const id = setInterval(function(){
			//넓이가 퍼센트와 같거나 더 커졌을 때 > stop
			if(width >= percent){
				clearInterval(id);
			//width 점점 늘어남
			} else {
				width++;
				toDoProgressBar.style.width = `${width}%`;
				completed.innerText = `${width}% completed`;
			}
		}, 5);
	//퍼센트 감소
	} else{
		const id = setInterval(function(){
			if(width <= percent){
				clearInterval(id);
			} else {
				width--;
				toDoProgressBar.style.width = `${width}%`;
				completed.innerText = `${width}% completed`;
			}
		}, 5);
	}
	//이전 퍼센트가 됨
	previousPercent = percent;
}

function selectCheckedNum(){
	checkedNum = 0;
	for(var i = 0; i < toDos.length; i++){
		if(toDos[i].isChecked === true){
			checkedNum = checkedNum + 1;
		}
	}
	//프로그레스 바
	paintProgressBar(checkedNum);
}

function deleteToDo(event){
	//paint X
	const btn = event.target;
	const btnSpan = btn.parentNode;
	const li = btnSpan.parentNode;
	toDoList.removeChild(li);
	//저장
	const cleanToDos = toDos.filter(function(toDo){
		return toDo.id !== parseInt(li.id);
	});
	toDos = cleanToDos;
	saveToDos();
	//nothing to do
	if(toDos.length === 0){
		paintNothing();
	}
	//체크수 조회 + 프로그레스 바
	selectCheckedNum();
}

//checkbox clicked
function checkBoxChange(event){
	const checkBox = event.target;
	const label = checkBox.parentNode;
	const li = label.parentNode;
	const isChecked = checkBox.checked;
	//저장
	for(var i = 0; i < toDos.length; i++){
		if(toDos[i].id === parseInt(li.id)){
			toDos[i].isChecked = isChecked;
		};
	}
	saveToDos();
	//체크수 조회 + 프로그레스 바
	selectCheckedNum();
}

function paintToDo(text, isChecked){
	//li > label > input(checkbox), span(content)
	const li = document.createElement("li");
	const label = document.createElement("label");
	const checkBox = document.createElement("input");
	checkBox.setAttribute("type", "checkbox");
	checkBox.setAttribute("class", "todoCheck");
	checkBox.checked = isChecked;
	const content = document.createElement("span");
	content.setAttribute("class", "content");
	//li > span(btns) > img(editBtn), img(delBtn)
	const btns = document.createElement("span");
	btns.setAttribute("class", "controlBtns");
	const editBtn = document.createElement("img");
	editBtn.setAttribute("class", "editBtn");
	editBtn.src = "ShareToDoList/templates/static/images/edit.png";
	const delBtn = document.createElement("img");
	delBtn.setAttribute("class", "delBtn");
	delBtn.src = "ShareToDoList/templates/static/images/delete.png";
	//eventListener(checkbox, edit, delete)
	checkBox.addEventListener("change", checkBoxChange);
	editBtn.addEventListener("click", showEdit);
	delBtn.addEventListener("click", deleteToDo);
	content.innerText = `${text}`;
	li.appendChild(label);
	label.appendChild(checkBox);
	label.appendChild(content);
	li.appendChild(btns);
	btns.appendChild(editBtn);
	btns.appendChild(delBtn);
	const newId = toDos.length + 1;
	li.id = newId;
	toDoList.appendChild(li);
	//저장
	const toDoObj = {
			text: text,
			id: newId,
			isChecked: isChecked
	};
	toDos.push(toDoObj);
	saveToDos();
}

//to do 작성완료
function toDoSubmit(event){
	event.preventDefault();
	const currentValue = toDoInput.value;
	if(currentValue === ""){ //공백확인
		empty.classList.add(SHOWING_CN);
	} else {
		empty.classList.remove(SHOWING_CN);
		//보여주기
		paintToDo(currentValue, false);
		//체크수 조회 + 프로그레스 바
		selectCheckedNum();
		toDoInput.value = "";
	}
}

function loadToDos(){
	const loadedToDos = localStorage.getItem(TODOS_LS);
	if(loadedToDos !== null){
		//loadedToDos(String) → parsedToDos(Array)
		const parsedToDos = JSON.parse(loadedToDos);
		if(parsedToDos.length === 0){
			//Nothing To Do
			paintNothing();
		} else {
			for(var i = 0; i < parsedToDos.length; i++){
				//todo들을 보여줌
				paintToDo(parsedToDos[i].text, parsedToDos[i].isChecked);
			};
			//체크수 조회 + 프로그레스 바
			selectCheckedNum();
		}
	} else {
		//Nothing To Do
		paintNothing();
	}
}

function init(){
	loadToDos();
	toDoForm.addEventListener("submit", toDoSubmit);
}
init();

