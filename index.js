
const addTaskBtn = document.getElementById("add-task");
const saveItemBtn = document.querySelector(".solid");
const addItemContainer = document.getElementById("add-item-container");
const addItem = document.querySelector(".add-item");


const listColumns = document.querySelectorAll(".drag-item-list");
const backlogListEl = document.getElementById("to-do-list");
const progressListEl = document.getElementById("doing-list");
const completeListEl = document.getElementById("done-list");


let toDoListArray = [];
let progressListArray = [];
let completeListArray = [];
let listArrays = [];

let draggedItem;
let dragging = false;
let currentColumn;


function getSavedColumns() {
    if (localStorage.getItem("toDoItems")) {
        toDoListArray = JSON.parse(localStorage.toDoItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
    } else {
            toDoListArray = [];
            progressListArray = [];
            completeListArray = [];
        
    }
}


function updateSavedColumns() {
    listArrays = [toDoListArray, progressListArray, completeListArray];
    const arrayNames = ["toDo", "progress", "complete"];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}


function filterArray(array) {
    const filteredArray = array.filter((item) => item !== null);
    return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, item, index) {
    const listEl = document.createElement("li"); 
    listEl.textContent = item;                    
    listEl.id = index;                            // Set the id of the list item to the provided index
    listEl.classList.add("drag-item");            // Add the class "drag-item" to the list item
    listEl.draggable = true;                      // Make the list item draggable
    listEl.setAttribute("ondragstart", "drag(event)");  // Set the ondragstart attribute to call the drag(event) function
    columnEl.appendChild(listEl);                 // Append the list item to the provided column element
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Backlog Column
    backlogListEl.textContent = "";
    toDoListArray.forEach((toDoItem, index) => {
        createItemEl(backlogListEl, toDoItem, index);
    });
    toDoListArray = filterArray(toDoListArray);

    // Progress Column
    progressListEl.textContent = "";
    progressListArray.forEach((progressItem, index) => {
        createItemEl(progressListEl, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);

    // Complete Column
    completeListEl.textContent = "";
    completeListArray.forEach((completeItem, index) => {
        createItemEl(completeListEl, completeItem, index);
    });
    completeListArray = filterArray(completeListArray);

    // Update localStorage
    updateSavedColumns();
}

// Add to Column List, Reset Textbox
function addToColumn() {
    const itemText = addItem.textContent;
    toDoListArray.push(itemText);
    addItem.textContent = "";
    updateDOM();
}

// Show Add Item Input Box
function showInputBox() {
    addTaskBtn.style.visibility = "hidden";
    saveItemBtn.style.display = "flex";
    addItemContainer.style.display = "flex";
}

// Hide Item Input Box
function hideInputBox() {
    addTaskBtn.style.visibility = "visible";
    saveItemBtn.style.display = "none";
    addItemContainer.style.display = "none";
    addToColumn();
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
    toDoListArray = [];
    for (let i = 0; i < backlogListEl.children.length; i++) {
        toDoListArray.push(backlogListEl.children[i].textContent);
    }
    progressListArray = [];
    for (let i = 0; i < progressListEl.children.length; i++) {
        progressListArray.push(progressListEl.children[i].textContent);
    }
    completeListArray = [];
    for (let i = 0; i < completeListEl.children.length; i++) {
        completeListArray.push(completeListEl.children[i].textContent);
    }
    updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
    listColumns[column].classList.add("over");
    currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
    e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
    e.preventDefault();
    const parent = listColumns[currentColumn];
    listColumns.forEach((column) => {
        column.classList.remove("over");
    });
    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
}


updateDOM();
