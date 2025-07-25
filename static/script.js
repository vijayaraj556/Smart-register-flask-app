// sta c/script.js 
// Global state variables 
let inventory = []; 
let totalProfit = 0; 
let totalLoss = 0; 
let edi ngItemId = null; // To keep track of the item being edited 
 
// DOM Elements 
// Naviga on 
const navAddItemBtn = document.getElementById('navAddItem'); 
const navInventoryViewBtn = document.getElementById('navInventoryView'); 
const navStockModifica onBtn = document.getElementById('navStockModifica on'); 
const navBu ons = document.querySelectorAll('.nav-bu on'); 
// Screens 
const addItemScreen = document.getElementById('addItemScreen'); 
const inventoryViewScreen = document.getElementById('inventoryViewScreen'); 
const stockModifica onScreen = document.getElementById('stockModifica onScreen'); 
// Add Item Screen Elements 
const itemForm = document.getElementById('itemForm'); 
const itemIdInput = document.getElementById('itemId'); 
const itemNameInput = document.getElementById('itemName'); 
const itemQuan tyInput = document.getElementById('itemQuan ty'); 
const itemPriceInput = document.getElementById('itemPrice'); // Now "Cost Price" 
const saveItemBtn = document.getElementById('saveItemBtn'); 
const clearFormBtn = document.getElementById('clearFormBtn'); 
// Inventory View Screen Elements 
const totalUniqueItemsDisplay = document.getElementById('totalUniqueItems'); 
const totalQuan tyDisplay = document.getElementById('totalQuan ty'); 
const totalValua onDisplay = document.getElementById('totalValua on'); 
const inventorySearchBar = document.getElementById('inventorySearchBar'); 
const inventoryList = document.getElementById('inventoryList'); 
const noItemsMessage = document.getElementById('noItemsMessage'); 
// Stock Modifica on Screen Elements 
const stockModifica onForm = document.getElementById('stockModifica onForm'); 
const modifyItemIdSelect = document.getElementById('modifyItemId'); 
const modifyQuan tyInput = document.getElementById('modifyQuan ty'); 
const reasonSaleRadio = document.getElementById('reasonSale'); 
const reasonDamageRadio = document.getElementById('reasonDamage'); 
const salePriceContainer = document.getElementById('salePriceContainer'); 
const salePriceInput = document.getElementById('salePrice'); 
const totalProfitDisplay = document.getElementById('totalProfitDisplay'); 
const totalLossDisplay = document.getElementById('totalLossDisplay'); 
// Global Message Box 
const globalMessageBox = document.getElementById('globalMessageBox'); 
/** 
* Shows a message in the global message box. 
* @param {string} message - The message to display. 
* @param {string} type - 'success', 'error', or 'info' to determine styling. 
*/ 
func on showMessage(message, type) { 
globalMessageBox.textContent = message; 
globalMessageBox.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red
100', 'text-red-800', 'bg-blue-100', 'text-blue-800'); 
if (type === 'success') { 
globalMessageBox.classList.add('bg-green-100', 'text-green-800'); 
} else if (type === 'error') { 
globalMessageBox.classList.add('bg-red-100', 'text-red-800'); 
} else if (type === 'info') { 
         globalMessageBox.classList.add('bg-blue-100', 'text-blue-800'); 
    } 
    globalMessageBox.classList.remove('hidden'); 
    setTimeout(() => { 
        globalMessageBox.classList.add('hidden'); 
    }, 3000); // Hide a er 3 seconds 
} 
 
/** 
 * Saves the current inventory, total profit, and total loss to local storage. 
 */ 
func on saveState() { 
    try { 
        localStorage.setItem('inventory', JSON.stringify(inventory)); 
        localStorage.setItem('totalProfit', totalProfit.toFixed(2)); 
        localStorage.setItem('totalLoss', totalLoss.toFixed(2)); 
    } catch (e) { 
        console.error("Error saving to local storage:", e); 
        showMessage("Error saving data locally.", 'error'); 
    } 
} 
 
/** 
 * Loads inventory, total profit, and total loss data from local storage. 
 */ 
func on loadState() { 
    try { 
        const storedInventory = localStorage.getItem('inventory'); 
        if (storedInventory) { 
            inventory = JSON.parse(storedInventory); 
        } 
        const storedProfit = localStorage.getItem('totalProfit'); 
        if (storedProfit) { 
            totalProfit = parseFloat(storedProfit); 
        } 
        const storedLoss = localStorage.getItem('totalLoss'); 
        if (storedLoss) { 
            totalLoss = parseFloat(storedLoss); 
        } 
    } catch (e) { 
        console.error("Error loading from local storage:", e); 
        showMessage("Error loading data from local storage.", 'error'); 
    } 
} 
 
/** 
 * Renders the inventory items to the table on the Inventory View screen. 
 * @param {Array} itemsToDisplay - The array of items to render (can be filtered). 
 */ 
func on renderInventory(itemsToDisplay = inventory) { 
    inventoryList.innerHTML = ''; // Clear exis ng list 
    if (itemsToDisplay.length === 0) { 
        noItemsMessage.classList.remove('hidden'); 
        return; 
    } else { 
        noItemsMessage.classList.add('hidden'); 
    } 
 
    itemsToDisplay.forEach(item => { 
        const row = document.createElement('tr'); 
        row.className = 'hover:bg-gray-50 transi on dura on-150 ease-in-out'; 
        row.innerHTML = ` 
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray
900">${item.id}</td> 
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${item.name}</td> 
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray
700">${item.quan ty}</td> 
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray
700">₹${item.price.toFixed(2)}</td> 
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"> 
                <bu on onclick="editItem('${item.id}')" 
                        class="text-blue-600 hover:text-blue-900 mr-3 px-3 py-1 rounded-md bg-blue
100 hover:bg-blue-200 transi on dura on-150 ease-in-out"> 
                    Edit 
                </bu on> 
                <bu on onclick="deleteItem('${item.id}')" 
                        class="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-100 
hover:bg-red-200 transi on dura on-150 ease-in-out"> 
                    Delete 
                </bu on> 
            </td> 
        `; 
        inventoryList.appendChild(row); 
    }); 
} 
 
/** 
 * Calculates and displays overall inventory metrics. 
 */ 
func on updateInventoryMetrics() { 
    const totalUnique = inventory.length; 
    const totalQty = inventory.reduce((sum, item) => sum + item.quan ty, 0); 
    const totalVal = inventory.reduce((sum, item) => sum + (item.quan ty * item.price), 0); 
 
    totalUniqueItemsDisplay.textContent = totalUnique; 
    totalQuan tyDisplay.textContent = totalQty; 
    totalValua onDisplay.textContent = `₹${totalVal.toFixed(2)}`; 
} 
 
/** 
 * Populates the item selec on dropdown on the Stock Modifica on screen. 
 */ 
func on populateModifyItemSelect() { 
    modifyItemIdSelect.innerHTML = '<op on value="">-- Select an item --</op on>'; // Clear 
exis ng op ons 
    inventory.forEach(item => { 
        const op on = document.createElement('op on'); 
        op on.value = item.id; 
        op on.textContent = `${item.name} (ID: ${item.id}, Qty: ${item.quan ty}, Cost: 
₹${item.price.toFixed(2)})`; 
        modifyItemIdSelect.appendChild(op on); 
    }); 
} 
 
/** 
 * Updates the profit and loss displays. 
 */ 
func on updateFinancialSummary() { 
    totalProfitDisplay.textContent = `₹${totalProfit.toFixed(2)}`; 
    totalLossDisplay.textContent = `₹${totalLoss.toFixed(2)}`; 
} 
 
/** 
 * Handles screen switching logic. 
 * @param {string} screenId - The ID of the screen to show. 
 */ 
func on showScreen(screenId) { 
    // Hide all screens 
    document.querySelectorAll('.screen').forEach(screen => { 
        screen.classList.remove('ac ve'); 
    }); 
 
    // Deac vate all nav bu ons 
    navBu ons.forEach(bu on => { 
        bu on.classList.remove('ac ve'); 
    }); 
 
    // Show the selected screen and ac vate its nav bu on 
    document.getElementById(screenId).classList.add('ac ve'); 
    if (screenId === 'addItemScreen') navAddItemBtn.classList.add('ac ve'); 
    if (screenId === 'inventoryViewScreen') { 
        navInventoryViewBtn.classList.add('ac ve'); 
        renderInventory(); // Re-render inventory when this screen is ac ve 
        updateInventoryMetrics(); // Update metrics when this screen is ac ve 
        inventorySearchBar.value = ''; // Clear search bar on screen switch 
    } 
    if (screenId === 'stockModifica onScreen') { 
        navStockModifica onBtn.classList.add('ac ve'); 
        populateModifyItemSelect(); // Populate dropdown when this screen is ac ve 
        updateFinancialSummary(); // Update financial summary 
        modifyQuan tyInput.value = ''; // Clear quan ty input 
        reasonSaleRadio.checked = true; // Default to sale 
        toggleSalePriceInput(); // Show/hide sale price input 
    } 
    clearForm(); // Clear the add/edit form when switching screens 
} 
 
// Event Listeners for Naviga on 
navAddItemBtn.addEventListener('click', () => showScreen('addItemScreen')); 
navInventoryViewBtn.addEventListener('click', () => showScreen('inventoryViewScreen')); 
navStockModifica onBtn.addEventListener('click', () => 
showScreen('stockModifica onScreen')); 
 
/** 
 * Handles the submission of the item form (add or edit). 
 * @param {Event} event - The form submission event. 
 */ 
itemForm.addEventListener('submit', func on(event) { 
    event.preventDefault(); // Prevent default form submission 
 
    const id = itemIdInput.value.trim(); 
    const name = itemNameInput.value.trim(); 
    const quan ty = parseInt(itemQuan tyInput.value); 
    const price = parseFloat(itemPriceInput.value); 
 
    // Basic valida on 
    if (!id || !name || isNaN(quan ty) || quan ty < 0 || isNaN(price) || price < 0) { 
        showMessage('Please fill in all fields with valid posi ve values.', 'error'); 
        return; 
    } 
 
    if (edi ngItemId) { 
        // Edi ng exis ng item 
        const itemIndex = inventory.findIndex(item => item.id === edi ngItemId); 
        if (itemIndex !== -1) { 
            // Check if ID was changed and if new ID is unique 
            if (edi ngItemId !== id && inventory.some(item => item.id === id)) { 
                showMessage('Item ID already exists. Please use a unique ID.', 'error'); 
                return; 
            } 
            inventory[itemIndex].id = id; // Update ID if changed 
            inventory[itemIndex].name = name; 
            inventory[itemIndex].quan ty = quan ty; 
            inventory[itemIndex].price = price; 
            showMessage('Item updated successfully!', 'success'); 
        } 
        edi ngItemId = null; // Reset edi ng state 
        saveItemBtn.textContent = 'Add Item'; // Change bu on back 
        itemIdInput.removeA ribute('readonly'); // Make ID editable again 
    } else { 
        // Adding new item 
        // Check for unique ID when adding a new item 
        if (inventory.some(item => item.id === id)) { 
            showMessage('Item ID already exists. Please use a unique ID.', 'error'); 
            return; 
        } 
 
        const newItem = { 
            id: id, 
            name: name, 
            quan ty: quan ty, 
            price: price // This is the cost price 
        }; 
        inventory.push(newItem); 
        showMessage('Item added successfully!', 'success'); 
    } 
 
    clearForm(); 
    saveState(); 
    renderInventory(); // Re-render the full inventory (in case we switch back) 
    updateInventoryMetrics(); // Update metrics 
    populateModifyItemSelect(); // Update dropdown 
}); 
 
/** 
 * Clears the form fields on the Add Item screen and resets edi ng state. 
 */ 
func on clearForm() { 
    itemIdInput.value = ''; 
    itemNameInput.value = ''; 
    itemQuan tyInput.value = ''; 
    itemPriceInput.value = ''; 
    edi ngItemId = null; 
    saveItemBtn.textContent = 'Add Item'; 
    itemIdInput.removeA ribute('readonly'); // Ensure ID is editable for new entries 
    itemNameInput.focus(); // Focus on the first input field 
} 
 
// Event listener for the clear form bu on 
clearFormBtn.addEventListener('click', clearForm); 
 
/** 
 * Populates the form with data of an item to be edited. 
 * @param {string} id - The ID of the item to edit. 
 */ 
func on editItem(id) { 
    const itemToEdit = inventory.find(item => item.id === id); 
    if (itemToEdit) { 
        itemIdInput.value = itemToEdit.id; 
        itemNameInput.value = itemToEdit.name; 
        itemQuan tyInput.value = itemToEdit.quan ty; 
        itemPriceInput.value = itemToEdit.price; 
        edi ngItemId = id; 
        saveItemBtn.textContent = 'Update Item'; 
        itemIdInput.setA ribute('readonly', 'true'); // Make ID read-only during edit 
        showScreen('addItemScreen'); // Switch to add item screen 
        itemNameInput.focus(); // Focus on the name input for quick edi ng 
        showMessage(`Edi ng item: ${itemToEdit.name}`, 'info'); 
    } 
} 
 
/** 
 * Deletes an item from the inventory. 
 * @param {string} id - The ID of the item to delete. 
 */ 
func on deleteItem(id) { 
    const ini alLength = inventory.length; 
    const deletedItem = inventory.find(item => item.id === id); 
    inventory = inventory.filter(item => item.id !== id); 
    if (inventory.length < ini alLength) { 
        showMessage(`Item "${deletedItem ? deletedItem.name : id}" deleted successfully!`, 
'success'); 
    } else { 
        showMessage('Item not found!', 'error'); 
    } 
    saveState(); 
    renderInventory(); // Re-render the full inventory 
    updateInventoryMetrics(); // Update metrics 
    populateModifyItemSelect(); // Update dropdown 
    clearForm(); // Clear the form if the deleted item was being edited 
} 
 
/** 
 * Filters inventory items based on search input on the Inventory View screen. 
 */ 
inventorySearchBar.addEventListener('input', func on() { 
    const searchTerm = inventorySearchBar.value.toLowerCase().trim(); 
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.id.toLowerCase().includes(searchTerm) 
    ); 
    renderInventory(filteredItems); 
}); 
 
/** 
 * Toggles the visibility of the sale price input based on the selected reason. 
 */ 
func on toggleSalePriceInput() { 
    if (reasonSaleRadio.checked) { 
        salePriceContainer.classList.remove('hidden'); 
        salePriceInput.setA ribute('required', 'true'); 
        // Set default sale price to item's cost price when selected item changes 
        const selectedItem = inventory.find(item => item.id === modifyItemIdSelect.value); 
        if (selectedItem) { 
            salePriceInput.value = selectedItem.price.toFixed(2); 
        } else { 
            salePriceInput.value = ''; 
        } 
    } else { 
        salePriceContainer.classList.add('hidden'); 
        salePriceInput.removeA ribute('required'); 
        salePriceInput.value = ''; 
    } 
} 
 
// Event listeners for reason radio bu ons 
reasonSaleRadio.addEventListener('change', toggleSalePriceInput); 
reasonDamageRadio.addEventListener('change', toggleSalePriceInput); 
 
// Event listener for item selec on change to update default sale price 
modifyItemIdSelect.addEventListener('change', toggleSalePriceInput); 
 
 
/** 
 * Handles the submission of the stock modifica on form. 
 * @param {Event} event - The form submission event. 
 */ 
stockModifica onForm.addEventListener('submit', func on(event) { 
    event.preventDefault(); 
 
    const selectedItemId = modifyItemIdSelect.value; 
    const quan tyChange = parseInt(modifyQuan tyInput.value); 
    const changeReason = 
document.querySelector('input[name="changeReason"]:checked').value; 
    const salePrice = parseFloat(salePriceInput.value); 
 
    if (!selectedItemId) { 
        showMessage('Please select an item.', 'error'); 
        return; 
    } 
    if (isNaN(quan tyChange) || quan tyChange <= 0) { 
        showMessage('Please enter a valid posi ve quan ty.', 'error'); 
        return; 
    } 
    if (changeReason === 'sale' && (isNaN(salePrice) || salePrice < 0)) { 
        showMessage('Please enter a valid sale price.', 'error'); 
        return; 
    } 
 
 
    const itemToModify = inventory.find(item => item.id === selectedItemId); 
 
    if (!itemToModify) { 
        showMessage('Selected item not found.', 'error'); 
        return; 
    } 
 
    if (quan tyChange > itemToModify.quan ty) { 
        showMessage('Cannot change more than available quan ty.', 'error'); 
        return; 
    } 
 
    // Perform stock modifica on 
    itemToModify.quan ty -= quan tyChange; 
 
    if (changeReason === 'sale') { 
        // Profit/Loss = (Sale Price - Cost Price) * Quan ty 
        const itemCostPrice = itemToModify.price; 
        const profitLossPerUnit = salePrice - itemCostPrice; 
        const transac onProfitLoss = profitLossPerUnit * quan tyChange; 
 
        if (transac onProfitLoss >= 0) { 
            totalProfit += transac onProfitLoss; 
            showMessage(`Sold ${quan tyChange} of ${itemToModify.name} for 
₹${salePrice.toFixed(2)} each. Profit: ₹${transac onProfitLoss.toFixed(2)}`, 'success'); 
        } else { 
            totalLoss += Math.abs(transac onProfitLoss); 
            showMessage(`Sold ${quan tyChange} of ${itemToModify.name} for 
₹${salePrice.toFixed(2)} each. Loss: ₹${Math.abs(transac onProfitLoss).toFixed(2)}`, 'info'); 
        } 
 
    } else if (changeReason === 'damage') { 
        totalLoss += (quan tyChange * itemToModify.price); // Loss is based on cost price 
        showMessage(`Logged ${quan tyChange} of ${itemToModify.name} as damaged. Loss: 
₹${(quan tyChange * itemToModify.price).toFixed(2)}`, 'info'); 
    } 
 
    // Remove item if quan ty drops to 0 or below 
    if (itemToModify.quan ty <= 0) { 
        inventory = inventory.filter(item => item.id !== selectedItemId); 
        showMessage(`${itemToModify.name} quan ty reached zero and was removed from 
inventory.`, 'info'); 
    } 
 
    saveState(); 
populateModifyItemSelect(); // Re-populate dropdown to reflect new quan es or 
removed items 
updateFinancialSummary(); // Update profit/loss display 
updateInventoryMetrics(); // Update overall inventory metrics 
renderInventory(); // Re-render inventory table if ac ve 
modifyQuan tyInput.value = ''; // Clear the quan ty input a er successful modifica on 
salePriceInput.value = ''; // Clear sale price input 
}); 
// Ini al load and render when the page loads 
document.addEventListener('DOMContentLoaded', () => { 
loadState(); 
showScreen('addItemScreen'); // Show the Add Item screen by default 
});
