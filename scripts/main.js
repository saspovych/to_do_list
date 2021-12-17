const input = document.querySelector('.new_task_input')
input.oninput = function() {
	input.value.length == 0
		? pushBtn.disabled = true
		: pushBtn.disabled = false;
}

input.addEventListener("keydown", (event) => {
	if (event.key === "Enter" && input.value !== '') {
		event.preventDefault();
		pushBtn.onclick();
	}
});

const pushBtn = document.getElementById('push');
pushBtn.onclick = function() {
	// Добавление нового элемента в localStorage
	let arr = JSON.parse(localStorage.getItem(`${listName}`));

	if (arr !== null) {
		arr[arr.length] = input.value;
		localStorage.setItem(`${listName}`, JSON.stringify(arr));
	} else {
		let newArray = [`${input.value}`];
		localStorage.setItem(`${listName}`, JSON.stringify(newArray));
	}
		renderLists();

		// Очистка поля ввода таска после добавления нового элемента
		input.value = "";
		pushBtn.disabled = true;
}

const modalPushBtn = document.getElementById('modal-push');
const modalInput = document.querySelector('.modal-list_name');
modalPushBtn.onclick = function() {
	// Добавление нового элемента в localStorage
	let arr = [];
	listName = modalInput.value;
	localStorage.setItem(`${listName}`, JSON.stringify(arr));
	modalInput.value = '';
	modal.style.display = 'none';
	taskList.classList.toggle('hidden');

	renderLists();
}

modalInput.oninput = function() {
	modalInput.value.length == 0
		? modalPushBtn.disabled = true
		: modalPushBtn.disabled = false;
}

modalInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter" && modalInput.value !== '') {
		event.preventDefault();
		modalPushBtn.onclick();
	}
});

function addDeleteEvent() {
	// Удаление элементов
	let current_tasks = document.querySelectorAll('.delete');
	for(let item of current_tasks) {
		item.addEventListener('click', () => {
			let arr = JSON.parse(localStorage.getItem(`${listName}`));
			arr.splice(item.parentNode.id, 1);
			localStorage.setItem(`${listName}`, JSON.stringify(arr));
			renderLists();
		})
	}
}

function addCompletedEvent() {
	// Зачёркивание элементов
	const tasks = document.querySelectorAll('.task');
	const taskItem = document.querySelectorAll('.task_name');
	const taskItemNumber = document.querySelectorAll('.task_number');
	const taskItemDate = document.querySelectorAll('.task_date');
	for(let i = 0; i < tasks.length; i++) {
		tasks[i].onclick = function() {
			taskItem[i].classList.toggle('completed');
			taskItemNumber[i].classList.toggle('completed');
			renderProgress();
		}
	}
}

let listName = localStorage.key(0);
const taskList = document.getElementById('task_list');
function addTasksListsEvent() {
	const tasksListsName = document.querySelectorAll('.demo_task_list');
	tasksListsName.forEach(item => {
		item.addEventListener('click', () => {
			listName = item.querySelector('.demo_task_list_title').textContent;
			taskList.classList.toggle('hidden');
			renderLists();
		})
	})
}

// Drag and drop functions
function addDropEvent() {
	const tasks = document.querySelectorAll('.task');
	tasks.forEach(item => {
		item.ondragover = allowDrop;
		item.ondragstart = drag;
		item.ondrop = drop;
	})
}

function allowDrop(event) {
	event.preventDefault();
}

function drag(event) {
	event.dataTransfer.setData('fromIndex', event.target.id);
}

function drop (event) {
	if (event.target.id) {
		const fromIndex = event.dataTransfer.getData('fromIndex');
		let arr = JSON.parse(localStorage.getItem(`${listName}`));

		let temp = arr[fromIndex];
		arr[fromIndex] = arr[event.target.id];
		arr[event.target.id] = temp;

		localStorage.setItem(`${listName}`, JSON.stringify(arr));
		renderLists();
	}

}

function renderLists() {
	let tasks = document.querySelector("#tasks");
	tasks.innerHTML = ``;

	const listTitle = document.getElementById('list_title');
	listTitle.innerHTML = `${listName}`;

	const arr = JSON.parse(localStorage.getItem(`${listName}`));
	if(arr !== null) {
		for (let i = 0; i < arr.length; i++) {
			tasks.innerHTML += ` <div class="task" id="${i}" draggable="true">
					<div class="task-lest_side">
						<span class="task_number">${i + 1}</span>
						<span class="task_name">${arr[i]}</span>
						<span class="date">${renderDate()}</span>
					</div>
					<button class="delete"><i class="fas fa-ban"></i></button>
				</div>`;
		}

		renderProgress();
		addDeleteEvent();
		addCompletedEvent();
		addDropEvent();
		// memoryOccupied();
	}
}

function renderProgress() {
	const progress = document.getElementById('progress');
	const tasks = document.querySelectorAll('.task_name');

	let completeCounter = 0, totalCounter = 0;

	tasks.forEach(item => {
		if(item.classList.contains('completed')) {
			completeCounter += 1;
		}
		totalCounter += 1;
	})

	progress.textContent = `${completeCounter} из ${totalCounter} дел`;
}

function renderDate() {
	let date = new Date();
	return `${convertToDayName(date.getDay())}, ${convertToMonthName(date.getMonth())} ${date.getDate()}`;
}

function renderTasksLists() {
	let tasksList = document.getElementById('task_list_name');
	tasksList.innerHTML = ``;
	for(let i = 0; i < localStorage.length; i++) {
		let demoTaskList = localStorage.key(i);
		tasksList.innerHTML += `
			<div class="demo_task_list">
				<h4 class="demo_task_list_title">${demoTaskList}</h4>
				<div class="demo_task_list_items"></div>
			</div>
		`;

		let demoListItem = document.querySelectorAll('.demo_task_list_items');
		let arr = JSON.parse(localStorage.getItem(localStorage.key(i)));
		for(let j = 0; j < arr.length; j++) {
			if(j !== 4) {
				demoListItem[i].innerHTML += `
					<span class="demo_task_list_item">${arr[j]}</span>
				`;
			}
		}
	}

	addTasksListsEvent();
}

function convertToDayName(dayNumber) {
	const dayName = [
		'Воскресень',
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота'
	];
	return dayName[dayNumber];
}

function convertToMonthName(monthNumber) {
	const monthName = [
		'Январь',
		'Февраль',
		'Март',
		'Апрель',
		'Май',
		'Июнь',
		'Июль',
		'Август',
		'Сентябрь',
		'Октябрь',
		'Ноябрь',
		'Декабрь'
	];
	return monthName[monthNumber];
}

const createNewList = document.getElementById('create_new_list');
createNewList.onclick = () => {
	btn.onclick();
	renderLists();
}

const modal = document.getElementById('my_modal');
const btn = document.getElementById('create_new_list');

btn.onclick = () => {
	modal.style.display = 'block';
}
window.onclick = function(event) {
	if(event.target == modal) {
		modal.style.display = 'none';
		renderTasksLists();
	}
}

const taskListBack = document.querySelector('.task_list-close');
taskListBack.onclick = () => {
	const taskList = document.getElementById('task_list');
	taskList.classList.toggle('hidden');
	renderTasksLists();
}







// Функция расчитывает сколько всего занято локальной памяти
// и сколько занимает каждый элемент в отдельности
function memoryOccupied() {
	let lsTotal = 0;
	for (let x in localStorage) {
		if (!localStorage.hasOwnProperty(x)) {
			continue;
		}
		let xLen = ((localStorage[x].length + x.length) * 2);
		lsTotal += xLen;
		console.log(x.substr(0, 50) + " = " + (xLen / 1024).toFixed(2) + " KB")
	};
	console.log("Total = " + (lsTotal / 1024).toFixed(2) + " KB");

}
renderTasksLists();