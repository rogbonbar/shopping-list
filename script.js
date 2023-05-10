const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearButton = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false



function displayItems() {
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach(item => addItemToDOM(item))
    checkUi()
}
function onAddItemSubmit(e) {
    e.preventDefault()

    const newItem = itemInput.value
    
    //Validate input
    if (newItem === '') {
        alert('Por favor agregue un artículo')
        return
    }
    // Check for editMode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        isEditMode = false
    } else {
        if (checkIfItemExist(newItem)) {
            alert('Este artículo ya existe')
            return
        }
    }
    
    //Create item DOM element
    
    addItemToDOM(newItem)

    //Add item to local storage

    addItemToStorage(newItem )


    checkUi()
    
    itemInput.value =''    
}
function addItemToDOM (item) {
    //Create List Item
    const li= document.createElement('li')
    li.appendChild(document.createTextNode(item))    
    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
    // Add li to the DOM
    itemList.appendChild(li)
}

function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes
    return icon;
}


//Function to add to localStorage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()

    //Add new item to array
    itemsFromStorage.push(item)
    //Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage() {
    let itemsFromStorage
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage
}

function onCLickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
    } else {
        setItemToEdit(e.target)
    }
}

function checkIfItemExist(item) {
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
    isEditMode = true
    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Modificar artículo'
    formBtn.style.backgroundColor = '#e63946'
    itemInput.value = item.textContent

}

function removeItem(item) {
    if (confirm('¿Estás seguro?')) {
        //Remove from DOM
        item.remove()
        //Remove item from storage
        removeItemFromStorage(item.textContent)
        
        checkUi()
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()
    // Fitler out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i)=> i !== item)

    //Re-set to localStorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

//Clear the whole list
function clearItems(e) {
    if (confirm('¿Seguro que quieres borrar toda la lista?')) {
        while(itemList.firstChild) {
            itemList.removeChild(itemList.firstChild)
        }
    }
    // CLear from localStorage
    localStorage.removeItem('items')
    checkUi()
}
//Filter the items in the list
function filterItems(e) {
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLocaleLowerCase()
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none'
        }
    })
}
//check UI
function checkUi() {
    itemInput.value = '' 
    const items = itemList.querySelectorAll('li')
    if (items.length === 0) {
        clearButton.style.display = 'none'
        itemFilter.style.display = 'none '
    } else {
        clearButton.style.display = 'block'
        itemFilter.style.display = 'block '
    }
    formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i> Agregar artículo'
    formBtn.style.backgroundColor = '#333'
    
    
    isEditMode = false
}

//Initialize app
function init () {

    //Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onCLickItem)
    clearButton.addEventListener('click', clearItems)
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
    
    checkUi()
}

init()
