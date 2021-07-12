const subtaskscontainer = document.querySelector(".subtasks-container");
const addmorebutton = document.createElement('button');
const modal = document.querySelector('.modal');
var sortingFunction = (x, y) => Number(x) - Number(y);
let currentView = "filter";
addmorebutton.append('Add more');
const subtaskHtml = `
    <input class="create-subtask-element" type="text" placeholder="Enter sub task and the time...">
    <input class="subtask-time" type="time">
`;
// document.getElementById('done').onclick=function change(){
//     let mt=document.querySelector("#create-main-task").value;
//     var add=`
//     <div class="task">
//         <div class="task-text">
//             ${mt}
//         </div>
//         <div class="delete-button">
//             <button>
//                 Delete
//             </button>
//         </div>
//     </div>
//     `;
//     let checkbox=document.createElement('input');
//     checkbox.type='checkbox';
//     const addElem=document.createElement('div');
//     addElem.classList.add('main-task')
//     addElem.innerHTML=add;
//     addElem.firstElementChild.firstElementChild.after(checkbox);
//     document.querySelectorAll('.create-subtask-element').forEach((element)=>{
//         const subtaskelem=`
//         <div class="task-text">
//             ${element.value}
//         </div>
//         <div class="delete-button">
//             <button>
//                 Delete
//             </button>
//         </div>
//     `;
//         const subtaskdiv=document.createElement('div');
//         subtaskdiv.classList.add('create-sub-task');
//         subtaskdiv.innerHTML=subtaskelem;
//         let newCheckbox=checkbox.cloneNode();
//         subtaskdiv.firstElementChild.after(newCheckbox);
//         addElem.append(subtaskdiv);
//         newCheckbox.addEventListener("click",checkboxHandle);
//     })
//     document.querySelector('.tasks-list').append(addElem);
//     checkbox.addEventListener("click",checkboxHandle);
// }
const addsubclassbutton = document.querySelector('#addsubtaskbutton');
addsubclassbutton.addEventListener("click", (event) => {
    subtaskscontainer.style.display = "initial";
    addsubclassbutton.style.display = "none";
    // addmorebutton.dispatchEvent('click');
    addmorebutton.click();
});
// const addmorebutton=document.querySelector(".add-more-button");
addmorebutton.addEventListener("click", (event) => {
    console.log("Here");
    const elem = document.createElement('div');
    elem.classList.add('add-sub-task');
    elem.innerHTML = subtaskHtml;
    elem.append(addmorebutton);
    subtaskscontainer.append(elem);
});
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
});
//Handling checkboxes
function checkboxHandle(event) {
    console.log(this.checked, this.previousElementSibling);
    if (this.checked)
        this.previousElementSibling.style.textDecoration = "line-through";
    else
        this.previousElementSibling.style.textDecoration = "initial";
}
//Reset input
function reset() {
    document.querySelectorAll("input[type='text']").forEach((element) => element.value = "");
}
document.querySelector("#reset").addEventListener("click", (event) => {
    reset();
});
//Show add task popup window
document.querySelectorAll('.add-task-button').forEach((button) => {
    const modal = document.querySelector('.modal');
    button.addEventListener('click', () => {
        // document.querySelector(".subtasks-container").innerHTML="";
        modal.style.display = "initial";
    });
});
//Close modal on outside click
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
//on submit store in local storage check if edit true
let editElementId = null;
if (!localStorage.currentId)
    localStorage.currentId = 2; //Update it on HTML change
document.getElementById('done').addEventListener('click', (event) => {
    let objStorage = {};
    let mt = document.querySelector("#create-main-task");
    objStorage['subtask'] = Array.from(document.querySelectorAll('.create-subtask-element')).map(elem => { return [elem.value, elem.parentElement.querySelector('.subtask-time').value]; });
    objStorage['mt'] = mt.value;
    objStorage['date'] = mt.nextElementSibling.value;
    objStorage['id'] = editElementId || localStorage.currentId;
    localStorage[editElementId || localStorage.currentId] = JSON.stringify(objStorage);
    if (!editElementId)
        localStorage.currentId = Number(localStorage.currentId) + 1;
    console.log(objStorage);
    reloadList();
    editElementId = null;
    reset();
    modal.style.display = "none";
});
function filterElementsAndShow() {
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
    mt.value = objStorage['mt'](mt.nextElementSibling).value = objStorage['date'];
    let numOfSubtasks = objStorage['subtask'].length;
    if (numOfSubtasks) {
        addsubclassbutton.click();
        numOfSubtasks--;
    }
    while (numOfSubtasks--)
        addmorebutton.click();
    let subElems = document.querySelectorAll('.create-subtask-element');
    console.log(subElems);
    for (let i = 0; i < subElems.length; i++)
        subElems[i].value = objStorage['subtask'][i][0];
}
filterElementsAndShow();
//Adding search functionality
document.querySelector('#search').addEventListener('keyup', function (event) {
    if (event.key == "Enter")
        filterBySearch(this.value);
});
function filterBySearch(searchString) {
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
        newObj['subtask'] = newObj['subtask'].filter(value => value[0] != textContent);
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
    document.querySelector('.tasks-list').innerHTML = "";
    if (showAllButton.classList.contains('show-all-active'))
        filterElementsAndShow();
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
    }
    showAllButton.classList.toggle('show-all-active');
}
//Sort function
document.querySelector("select").addEventListener('change', function () {
    console.log(this.value);
    if (this.value == 'none')
        sortingFunction = (x, y) => Number(x) - Number(y);
    else if (this.value == 'alphabetical')
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).mt, y1 = JSON.parse(localStorage[y]).mt;
            if (x1 > y1)
                return 1;
            if (x1 == y1)
                return 0;
            return -1;
        };
    else if (this.value == "reverse-alphabetical")
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).mt, y1 = JSON.parse(localStorage[y]).mt;
            if (x1 > y1)
                return -1;
            if (x1 == y1)
                return 0;
            return 1;
        };
    else if (this.value == "inc-date")
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).date, y1 = JSON.parse(localStorage[y]).date;
            if (x1 > y1)
                return 1;
            if (x1 == y1)
                return 0;
            return -1;
        };
    else if (this.value == "dec-date")
        sortingFunction = (x, y) => {
            let x1 = JSON.parse(localStorage[x]).date, y1 = JSON.parse(localStorage[y]).date;
            if (x1 > y1)
                return -1;
            if (x1 == y1)
                return 0;
            return 1;
        };
    reloadList();
});
function reloadList() {
    if (currentView == "filter")
        filterElementsAndShow();
    if (currentView == "show-all") {
        document.querySelector('.button-show-all').click();
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
        if (highlight.indexOf(searchString) != -1)
            highlight = highlight.split(searchString).join("<span style='background-color: yellow;'>" + searchString + "</span>");
        const subtaskelem = `
        <div class="task-text">
            ${highlight}}
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
//Update Time Left
//Add Priority
