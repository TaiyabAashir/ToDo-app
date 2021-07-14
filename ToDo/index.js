"use strict";
var _a;
const subtasksContainer = document.querySelector(".subtasks-container");
const addMoreButton = document.createElement('button');
const removeMoreButton = document.createElement('button');
const modal = document.querySelector('.modal');
var sortingFunction = (x, y) => Number(x) - Number(y);
let currentView = "filter";
addMoreButton.innerHTML = `<img id="plus" src='./plus.svg'>`;
addMoreButton.classList.add('add-more-button');
addMoreButton.setAttribute('type', 'button');
removeMoreButton.innerHTML = `<img id="minus" src='./minus.svg'>`;
removeMoreButton.classList.add('remove-more-button');
removeMoreButton.id = "remove-subtask-button";
removeMoreButton.setAttribute('type', 'button');
const subtaskHtml = `
    <input required class="create-subtask-element" type="text" placeholder="Enter sub task and the time...">
    <input class="subtask-time" type="time">
`;
const addSubclassButton = document.querySelector('#addsubtaskbutton');
//Show subtask
addSubclassButton.addEventListener("click", (event) => {
    subtasksContainer.style.display = "initial";
    addSubclassButton.style.display = "none";
    subtasksContainer.innerHTML = "";
    // addmorebutton.dispatchEvent('click');
    addMoreButton.click();
});
// const addmorebutton=document.querySelector(".add-more-button");
addMoreButton.addEventListener("click", (event) => {
    console.log("Click add");
    const elem = document.createElement('div');
    elem.classList.add('add-sub-task');
    elem.innerHTML = subtaskHtml;
    elem.append(addMoreButton);
    elem.append(removeMoreButton.cloneNode(true));
    subtasksContainer.append(elem);
    elem.scrollIntoView();
});
//Remove subtask
function removeSubtask(eventTarget) {
    console.log("Click remove", subtasksContainer.childElementCount);
    if (subtasksContainer.childElementCount === 1) {
        let subtaskToRemove = subtasksContainer.lastElementChild;
        subtaskToRemove.remove();
        subtasksContainer.style.display = "none";
        addSubclassButton.style.display = "initial";
    }
    else {
        console.log("Remove mul");
        let subtaskToRemove = eventTarget.closest('div');
        console.log();
        subtaskToRemove.remove();
        if (subtaskToRemove.childElementCount === 4) {
            let subtaskLeft = subtasksContainer.lastElementChild;
            subtaskLeft.lastElementChild.remove();
            subtaskLeft.append(addMoreButton, removeMoreButton.cloneNode(true));
        }
    }
}
//Filter by date
var dateString = "today";
let currentDateView = new Date();
let filterDate = document.querySelector('#filter-date');
filterDate.addEventListener("change", (event) => {
    const dateCreated = filterDate.value ? new Date(filterDate.value) : new Date();
    dateString = dateCreated.toDateString() == (new Date()).toDateString() ? "today" : `${dateCreated.toLocaleString('default', { month: 'short' })} ${dateCreated.getDate()}`;
    document.querySelector('#view-date').innerText = dateString;
    currentDateView = dateCreated;
    filterElementsAndShow();
    // event.preventDefault();
});
filterDate.value = (new Date()).toISOString().split('T')[0];
//Handling checkboxes
function checkboxHandle(event) {
    console.log(this.checked, this.previousElementSibling);
    if (this.checked) {
        this.previousElementSibling.style.textDecoration = "line-through";
    }
    else {
        this.previousElementSibling.style.textDecoration = "initial";
    }
}
//Reset input
function reset() {
    document.querySelectorAll("input[type='text']").forEach((element) => element.value = "");
}
document.querySelector("#reset").addEventListener("click", (event) => {
    reset();
});
//Show add task popup window(modal)
document.querySelectorAll('.add-task-button').forEach((button) => {
    const modal = document.querySelector('.modal');
    button.addEventListener('click', (e) => {
        // document.querySelector(".subtasks-container").innerHTML="";
        if (e.screenX && e.screenX != 0 && e.screenY && e.screenY != 0) {
            reset();
            subtasksContainer.style.display = "none";
            addSubclassButton.style.display = "initial";
            for (let childElement of subtasksContainer.children)
                childElement.remove();
        }
        modal.style.display = "initial";
    });
});
//Close modal on outside click
window.onclick = function (event) {
    let eventTarget = event.target;
    if (eventTarget == modal || eventTarget.id == 'close-modal' || event.target.id == 'close-modal-button') {
        modal.style.display = "none";
    }
    if (eventTarget.id == "minus" || eventTarget.id === 'remove-subtask-button') {
        removeSubtask(eventTarget);
    }
};
//on submit store in local storage check if edit true
let editElementId = null;
if (!localStorage.currentId)
    localStorage.currentId = 2; //Update it on HTML change
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    let objStorage = {};
    let mt = document.querySelector("#create-main-task");
    objStorage['subtask'] = Array.from(document.querySelectorAll('.create-subtask-element')).map(elem => { return [elem.value, elem.parentElement.querySelector('.subtask-time').value]; });
    objStorage['mt'] = mt.value;
    objStorage['date'] = mt.nextElementSibling.value;
    objStorage['id'] = editElementId || localStorage.currentId;
    localStorage[editElementId || localStorage.currentId] = JSON.stringify(objStorage);
    if (!editElementId) {
        localStorage.currentId = Number(localStorage.currentId) + 1;
    }
    console.log(objStorage);
    reloadList();
    editElementId = null;
    reset();
    modal.style.display = "none";
});
function filterElementsAndShow() {
    undoShowAll();
    document.querySelector('.tasks-list').innerHTML = "";
    let keyList = Object.keys(localStorage).filter((key) => key != "currentId");
    console.log(sortingFunction);
    keyList.sort(sortingFunction);
    for (let key of keyList) {
        if (key == "currentId")
            continue;
        let elem = JSON.parse(localStorage[key]);
        if ((new Date(elem.date)).toDateString() == currentDateView.toDateString())
            showTask(elem);
    }
    currentView = "filter";
}
function showTask(objStorage) {
    var template = `
        <div class="task">
            <div class="task-text">
                <strong>${objStorage.mt}</strong>
            </div>
            <div class="delete-button">
                <button>
                    <img src='./del.svg'></img>
                </button>
            </div>
        </div>
    `;
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const addElem = document.createElement('div');
    addElem.classList.add('main-task');
    // addElem.id=String(localStorage.currentId);
    addElem.innerHTML = template;
    addElem.firstElementChild.firstElementChild.after(checkbox);
    objStorage['subtask'].forEach((value) => {
        const subtaskelem = `
        <div class="task-text">
            ${value[0]}
        </div>
        <div class="delete-button">
        <button>
             <img src='./del.svg'></img>
          </button>
        </div>
        `;
        const subtaskdiv = document.createElement('div');
        subtaskdiv.classList.add('create-sub-task');
        subtaskdiv.innerHTML = subtaskelem;
        let newCheckbox = checkbox.cloneNode();
        subtaskdiv.firstElementChild.after(newCheckbox);
        addElem.append(subtaskdiv);
        newCheckbox.addEventListener("click", checkboxHandle);
    });
    addElem.addEventListener('click', (event) => editElement(event, objStorage.id));
    document.querySelector('.tasks-list').append(addElem);
    checkbox.addEventListener("click", checkboxHandle);
}
function editElement(event, id) {
    console.log(event);
    if (event.target.tagName == "IMG") {
        deleteElement(event.target, id);
        return;
    }
    if (event.target.tagName == "INPUT")
        return;
    editElementId = id;
    console.log('edit id', id);
    reset();
    populateForm(id);
    document.querySelector('.add-task-button').click();
}
function populateForm(id) {
    let objStorage = JSON.parse(localStorage[id]);
    let mt = document.querySelector("#create-main-task");
    document.querySelector('.subtasks-container').innerHTML = "";
    mt.value = objStorage['mt'];
    mt.nextElementSibling.value = objStorage['date'];
    let numOfSubtasks = objStorage['subtask'].length;
    console.log('Number of subtasks in edit', numOfSubtasks);
    if (numOfSubtasks) {
        addSubclassButton.click();
        numOfSubtasks--;
    }
    else {
        addSubclassButton.style.display = "initial";
    }
    while (numOfSubtasks--)
        addMoreButton.click();
    let subElems = document.querySelectorAll('.create-subtask-element');
    console.log(subElems);
    for (let i = 0; i < subElems.length; i++) {
        subElems[i].value = objStorage['subtask'][i][0];
        subElems[i].nextElementSibling.value = objStorage['subtask'][i][1];
    }
}
filterElementsAndShow();
//Adding search functionality
document.querySelector('#search').addEventListener('keyup', function (event) {
    if (event.key == "Enter")
        filterBySearch(this.value);
});
function filterBySearch(searchString) {
    undoShowAll();
    document.querySelector('.tasks-list').innerHTML = "";
    let keyList = Object.keys(localStorage).filter((key) => key != "currentId");
    console.log(sortingFunction);
    keyList.sort(sortingFunction);
    for (let key of keyList) {
        console.log("Key ", key);
        if (key == "currentId")
            continue;
        let elem = JSON.parse(localStorage[key]);
        if (hasString(elem, searchString))
            showTaskHighlight(elem, searchString);
    }
    currentView = "search";
}
function hasString(objStorage, searchString) {
    let has = false;
    console.log(searchString, objStorage['subtask']);
    if (objStorage.mt.indexOf(searchString) != -1)
        return true;
    objStorage['subtask'].forEach((value) => {
        if (value[0].indexOf(searchString) != -1)
            has = true;
    });
    return has;
}
//Edit and Delete
function deleteElement(imgElem, id) {
    if (imgElem.closest('.create-sub-task')) {
        let textContent = imgElem.closest('.create-sub-task').querySelector('.task-text').innerText;
        let newObj = JSON.parse(localStorage[id]);
        newObj['subtask'] = newObj['subtask'].filter((value) => value[0] != textContent);
        localStorage[id] = JSON.stringify(newObj);
    }
    else {
        localStorage.removeItem(id);
    }
    reloadList();
}
//All task
document.querySelector('.button-show-all').addEventListener("click", function (event) { showAll(this); });
function showAll(showAllButton) {
    console.log("Show toggle");
    document.querySelector('.tasks-list').innerHTML = "";
    if (showAllButton.classList.contains('show-all-active')) {
        filterElementsAndShow();
    }
    else {
        let keyList = Object.keys(localStorage).filter((key) => key != "currentId");
        console.log(sortingFunction);
        keyList.sort(sortingFunction);
        for (let key of keyList) {
            console.log(key);
            if (key == "currentId")
                continue;
            let elem = JSON.parse(localStorage[key]);
            showTask(elem);
        }
        currentView = "show-all";
        showAllButton.classList.toggle('show-all-active');
    }
}
function undoShowAll() {
    let showAllButton = document.querySelector('.button-show-all');
    if (showAllButton.classList.contains('show-all-active')) {
        showAllButton.classList.remove('show-all-active');
    }
}
//Sort function
document.querySelector("select").addEventListener('change', function () {
    console.log(this.value);
    if (this.value == 'created-time')
        sortingFunction = (x, y) => Number(x) - Number(y);
    else if (this.value == 'alphabetical')
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).mt.toLowerCase(), y1 = JSON.parse(localStorage[y]).mt.toLowerCase();
            if (x1 > y1)
                return 1;
            if (x1 == y1)
                return 0;
            return -1;
        };
    else if (this.value == "reverse-alphabetical")
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).mt.toLowerCase(), y1 = JSON.parse(localStorage[y]).mt.toLowerCase();
            if (x1 > y1)
                return -1;
            if (x1 == y1)
                return 0;
            return 1;
        };
    else if (this.value == "inc-date") {
        currentView = "show-all";
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).date, y1 = JSON.parse(localStorage[y]).date;
            if (x1 > y1)
                return 1;
            if (x1 == y1)
                return 0;
            return -1;
        };
    }
    else if (this.value == "dec-date") {
        currentView = "show-all";
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).date, y1 = JSON.parse(localStorage[y]).date;
            if (x1 > y1)
                return -1;
            if (x1 == y1)
                return 0;
            return 1;
        };
    }
    reloadList();
});
function reloadList() {
    console.log("Reloading List");
    if (currentView == "filter") {
        filterElementsAndShow();
    }
    if (currentView == "show-all") {
        undoShowAll();
        document.querySelector('.button-show-all').click();
    }
    if (currentView == 'search')
        filterBySearch(document.querySelector('#search').value);
}
//Highliht search
function showTaskHighlight(objStorage, searchString) {
    let highlight = `${objStorage.mt}`;
    if (highlight.indexOf(searchString) != -1)
        highlight = highlight.split(searchString).join("<span style='background-color: yellow;'>" + searchString + "</span>");
    var template = `
        <div class="task">
            <div class="task-text">
                <strong>${highlight}</strong>
            </div>
            <div class="delete-button">
                <button>
                    <img src='./del.svg'></img>
                </button>
            </div>
        </div>
    `;
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const addElem = document.createElement('div');
    addElem.classList.add('main-task');
    // addElem.id=String(localStorage.currentId);
    addElem.innerHTML = template;
    addElem.firstElementChild.firstElementChild.after(checkbox);
    objStorage['subtask'].forEach((value) => {
        let highlight = `${value[0]}`;
        if (highlight.indexOf(searchString) != -1) {
            highlight = highlight.split(searchString).join("<span style='background-color: yellow;'>" + searchString + "</span>");
        }
        const subtaskelem = `
        <div class="task-text">
            ${highlight}
        </div>
        <div class="delete-button">
        ${value[1]}
        <button>
             <img src='./del.svg'></img>
          </button>
        </div>
        `;
        const subtaskdiv = document.createElement('div');
        subtaskdiv.classList.add('create-sub-task');
        subtaskdiv.innerHTML = subtaskelem;
        let newCheckbox = checkbox.cloneNode();
        subtaskdiv.firstElementChild.after(newCheckbox);
        addElem.append(subtaskdiv);
        newCheckbox.addEventListener("click", checkboxHandle);
    });
    addElem.addEventListener('click', (event) => editElement(event, objStorage.id));
    document.querySelector('.tasks-list').append(addElem);
    checkbox.addEventListener("click", checkboxHandle);
}
//Min date validation
(_a = document.getElementById("new-task-date")) === null || _a === void 0 ? void 0 : _a.setAttribute('min', (new Date()).toISOString().split('T')[0]);
//Close modal
// document.querySelector("#close-modal").addEventListener
//Update Time Left
//Add Priority
