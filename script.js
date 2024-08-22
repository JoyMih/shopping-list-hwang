// Declare the global variables needed
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
let isEditMode = false; // We want to edit this value later and have a falsy default
const formButton = itemForm.querySelector("button");

// Create functions to be used

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    checkUI(); // to make sure we DO display the filter and clear all buttons upon DOM reloading
}

function onAddItemSubmit(eventObj) {
    eventObj.preventDefault();

    const newItem = itemInput.value;

    // Setting up Validations for Input
    if (itemInput.value === "") {
        alert("Please add an item!");
        return; // This is so that nothing else can happen after this if statement alert is triggered.
    }
    // Create item DOM element
    addItemToDOM(newItem);
    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = ""; // After all of that creation, clear the value (in the text node);
}


function addItemToDOM(newItem) {
    // Create a new list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(newItem)); // we want to append what is inside of the inside of the list item, i.e. the newItem (which is inside of a newly created Text Node, which adds text interactivity to this part of the document).

    // We want to call on a function that creates a new "delete" icon/button. 
    // To do this we are going to create a SEPARATE function  outside of this function that generates that button for us called createButton().
    // Inside the parameters (), we include the classes associated with the very same buttons we have constructed in the HTML document. 

    const button = createButton("remove-item btn-link text-red"); // call the function in.

    li.appendChild(button); // now add the button to the list item.

    // Add li to the DOM
    itemList.appendChild(li);// add the list item, li, to the DOM
}

function createButton(classes) {
    const button = document.createElement("button"); // we want to append what is inside of the inside of the list item (by adding a button to the newly created list item), hence we use createElement("button"), where "button" is the inserted element.

    button.className = classes; // we want the button to have a class name. This is what we set earlier as the parameter for the input argument. Here, .className simply assigns the classes for said newly created button.

    const icon = createIcon("fa-solid fa-xmark"); // summon the createIcon() function.
    button.appendChild(icon); // append within the button itself to add icon into the button.

    return button; // Return the button.
}

function createIcon(classes) {
    const icon = document.createElement("i"); // the i tag for icon.
    icon.className = classes; // set the class name
    return icon; // return the icon!
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage(); // initialize the variable representing the local storage
    // Add new item to array

    itemsFromStorage.push(item);

    // Reconvert back into to JSON string & set to local storage!!!
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

// Get/retrieve items from the Local Storage
function getItemsFromStorage() {
    let itemsFromStorage; // initialize the variable representing the local storage
    if (localStorage.getItem("items") === null) { // Check to see if there are null items
        itemsFromStorage = []; // If no, set variable to empty array
    }
    else { // If yes, parse the string back into array (to its original form in which the code can work with)
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement); // This will only remove the item that has a parent whose classes (i.e. its classList) contains the specific class of "remove-item", which is the button/icon in this case.
    }
    else{
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true; // This it the global variable we call in to change when setItemToEdit() function is called

    itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode")); // Removing the edit-mode class to return original default text color
    
    item.classList.add("edit-mode") // Changing appearance during this call to denote that something is happening
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formButton.style.backgroundColor = "#228B22"; // Changing to a lovely green colored button
    itemInput.value = item.textContent; // Where itemInput is the text INPUT and item is the ELEMENT.
}

function removeItem(item) {
    if (window.confirm("Are you sure you want to Delete?")) {
        item.remove(); // Removing item from DOM : traversing the DOM to first get to the parent (the button/icon) --> Then to the parent of the button (the list item)

        removeItemFromStorage(item.textContent)// Removing the item from Local Storage

        checkUI(); // We must use checkUI after removal is approved because we need to override and account for the changes in items.length
    }
}

function removeItemFromStorage (item) {
    let itemsFromStorage = getItemsFromStorage();
    //Filtering out the item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item); // return a new array with the deleted items REMOVED!!! This should filter out whatever item was passed in.

    // Reset to Local Storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage)); // Using key of "items", then using JSON to stringify
}

function clearItems(e) {
    // while the item list has a first child (i.e. the first list item)
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild); // using remove Child on the ul, passing in the first child  

        checkUI(); // we must use checkUI after removal is approved because we need to override and account for the changes in items.length
    }
    // Clearing from LocalStorage
    localStorage.removeItem("items"); // Using "items" key to remove respective key values
    checkUI();
}

function filterItems(e) {
    const text = e.target.value.toLowerCase(); // get the text
    const items = itemList.querySelectorAll("li") // get the list items (remember, these aren't global)
    items.forEach((item) => { // use .forEach() since this is a node list
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        }
        else {
            item.style.display = "none";
        }
    });
}

// Creating a function to check UI: goal is to check the states of items
function checkUI() {
    const items = itemList.querySelectorAll("li"); // remember that when you use .querySelectorAll, you get the node list (similar to an array). 
    // Remember that this is declared within the function so that every time the page is loaded up and the function is called, we intake the array length again as new.
    if (items.length === 0) {
        clearButton.style.display = "none";
        itemFilter.style.display = "none";
    }
    else {
        clearButton.style.display = "block";
        itemFilter.style.display = "block";
    }
}

// Function to initialize the app. This can be more advantageous and more clean due to the fact that the variables are encapsulated and NOT made accessible to the global scope anymore (prior to moving in lines 145-152 into a function, this block of code was just exposed to the rest of this document).
function init() {
    // Event Listeners
    itemForm.addEventListener("submit", onAddItemSubmit); // calling function addItem
    itemList.addEventListener("click", onClickItem); // calling function removeItem
    clearButton.addEventListener("click", clearItems); // to clear the items
    itemFilter.addEventListener("input", filterItems); // filter through items
    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}

init();