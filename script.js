// Declare the global variables needed
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");

// Create functions to be used
function addItem (eventObj) {
    eventObj.preventDefault();

    const newItem = itemInput.value;

    // Setting up Validations for Input
    if(itemInput.value === "") {
        alert("Please add an item!");
        return; // This is so that nothing else can happen after this if statement alert is triggered.
    }

    // Create a new list item
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(newItem)); // we want to append what is inside of the inside of the list item, i.e. the newItem (which is inside of a newly created Text Node, which adds text interactivity to this part of the document).

        // We want to call on a function that creates a new "delete" icon/button. 
        // To do this we are going to create a SEPARATE function  outside of this function that generates that button for us called createButton().
        // Inside the parameters (), we include the classes associated with the very same buttons we have constructed in the HTML document. 

        const button = createButton("remove-item btn-link text-red"); // call the function in.

        li.appendChild(button); // now add the button to the list item.
        
        itemList.appendChild(li);// add the list item, li, to the DOM

        itemInput.value = ""; // after all of that creation, clear the value (in the text node);
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


// Set Up the necessary Event Listeners
itemForm.addEventListener("submit", addItem);
// itemInput.addEventListener(,);
// itemList.addEventListener(,);