let dataList = {}
let setCount = 0; 
function scrollDownToLast(element){
    let tableEditor = document.getElementById('form')
    tableEditor.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
    });
}
function addExpense(edit='true', disableList = [], dataset=[]) {
    setCount++; // Increment the set count
    // Create a new div element for the set
    console.log(dataset)
    const formSet = document.createElement('div');
    formSet.id = `set${setCount}`;
    formSet.className = 'expense-set';

    if (edit === 'false') {
        disableList = ['true', 'true', 'true', 'true', 'true']
    }
    // Create and append the form elements
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `expenseEdit${setCount}`;
    checkbox.name = `expenseEdit${setCount}`;
    checkbox.className = 'expense-input input-edit';
    checkbox.checked = edit === 'true';

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.name = `expenseDate${setCount}`;
    dateInput.id = `expenseDate${setCount}`;
    dateInput.className = 'expense-input input-date';
    dateInput.disabled = disableList[0] === 'true';

    const categorySelect = document.createElement('select');
    categorySelect.name = `expenseCategory${setCount}`;
    categorySelect.id = `expenseCategory${setCount}`;
    categorySelect.className = 'expense-input input-category';
    categorySelect.onchange = function() { loadTheSubCategoryData(this); };
    categorySelect.disabled = disableList[1] === 'true';

    const subCategorySelect = document.createElement('select');
    subCategorySelect.name = `subexpenseCategory${setCount}`;
    subCategorySelect.id = `subexpenseCategory${setCount}`;
    subCategorySelect.className = 'expense-input input-subcategory';
    subCategorySelect.disabled = disableList[2] === 'true';

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.name = `expense${setCount}`;
    amountInput.id = `expense${setCount}`;
    amountInput.className = 'expense-input input-amount';
    amountInput.setAttribute('step', '50');
    amountInput.setAttribute('min', '1');
    amountInput.addEventListener('blur', function() {
        if (this.value === '' || parseFloat(this.value) < 1) {
            this.value = 1;
        }
    }); 
    amountInput.disabled = disableList[3] === 'true';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'expense-input input-delete';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.disabled = disableList[4] === 'true';
    if (disableList[4] === 'false') {
        deleteButton.style.backgroundColor = "#dc3545"; // Set background color if not disabled
    }
    deleteButton.onclick = function() { 
        formSet.remove(); 
    }; // Remove the set on click // TODO:CONFIRM BEFORE DELETE

    // Append all elements to the form set div
    formSet.appendChild(checkbox);
    formSet.appendChild(dateInput);
    formSet.appendChild(categorySelect);
    formSet.appendChild(subCategorySelect);
    formSet.appendChild(amountInput);
    formSet.appendChild(deleteButton);

    // Append the new set to the container
    const container = document.getElementById('form');
    container.appendChild(formSet);

    
    populateTheData(`expenseDate${setCount}`,`expenseCategory${setCount}`, `subexpenseCategory${setCount}`,`expense${setCount}`, dataset);

    scrollDownToLast(formSet);
}

// Event listener for the button to add a new set
document.getElementById('addSetButton').addEventListener('click', function() {
    let date = new Date().toISOString().slice(0,10);
    const category = dataList["CATEGORIES"][0];
    const subcategory = dataList[category][0];
    //dataset=['2009-01-31','Hotel Dinner','Hotel D',5678]
    let dataset=[date,category,subcategory,'1']
    let disableList = ['false', 'false', 'false', 'false', 'false']
    addExpense(edit='true',disableList=disableList, dataset=dataset); // Call addExpense with default disableList
});

function populateTheData(expenseDateId, categoryId, subcategoryId, expenseId, dataset) {
    populateExpenseDate(expenseDateId, dataset[0]);
    populateCategoryData(categoryId, dataset[1]);
    populateSubCategoryData(dataset[1],subcategoryId, dataset[2]);
    populateExpenseData(expenseId, dataset[3]);
}

function populateExpenseDate(expenseDateId, value){
    document.getElementById(expenseDateId).value = value;
}

function populateExpenseData(expenseId, value){
    document.getElementById(expenseId).value = value;
}

function populateCategoryData(categoryId, value) {
    const categories = dataList["CATEGORIES"];
    // const categories = dataList["CATEGORIES"].sort((a, b) => a.localeCompare(b));;
    const selectElement = document.getElementById(categoryId);
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        selectElement.appendChild(option);
    });
    
    const existingOption = Array.from(selectElement.options)
    .find(option => option.value === value);

    // If option doesn't exist, create and append
    if (!existingOption) {
        const newOption = document.createElement('option');
        newOption.value = value;
        newOption.text = value;
        //newOption.setAttribute('data-customDisable', 'true');
        //newOption.style.display = 'none';
       // newOption.hidden = true;
        selectElement.appendChild(newOption);
        //selectElement.disabled = true;
    }
    selectElement.value = value;

    

    const option = document.createElement('option');
    option.value = "add_edit";
    option.text = "Add new / edit";
    option.classList.add('add_edit');
    const editModal = document.getElementById('editModal');
    const editModalTitle = document.getElementById('editModal-title');
    const editModalContent = document.getElementById('editModal-content');
    option.addEventListener('click', function() {
        console.log('Option clicked:', this.value);
        selectElement.value = categories[0];
        editModal.style.display = 'block';
        editModalTitle.innerText = "Add / Edit Categories"
        createList(editModalContent, categories)
    });

    selectElement.appendChild(option);
}

function createList(listContainer, list) {
    listContainer.innerHTML = ''; // Clear existing list
    
    const table = document.createElement('table');
    const tableBody = document.createElement('tbody');

    list.forEach((item, index) => {
        const tableRow = document.createElement('tr');
        
        // Create input cell
        const inputCell = document.createElement('td');
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = item;
        inputField.classList.add('editList');
        inputCell.appendChild(inputField);
        inputField.disabled = 'true'

        // Create actions cell
        const actionsCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('deleteList');
        deleteButton.disabled = 'true'
        deleteButton.addEventListener('click', () => {
            tableRow.remove();
        });

        actionsCell.appendChild(deleteButton);

        // Append cells to row
        tableRow.appendChild(inputCell);
        tableRow.appendChild(actionsCell);
        tableBody.appendChild(tableRow);
    });
    table.appendChild(tableBody);
    listContainer.appendChild(table);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = "listItemBtnGroup";

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'listItemBtn';
    addButton.innerText = 'Add New';
    addButton.onclick = function() { };
    buttonGroup.appendChild(addButton);

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'listItemBtn';
    saveButton.innerText = 'Save';
    saveButton.onclick = function() { };
    buttonGroup.appendChild(saveButton);
    
    listContainer.appendChild(buttonGroup);

}

function populateSubCategoryData(category, subcategoryId, value){
    const subCategories = dataList[category];

    const selectElement = document.getElementById(subcategoryId);
    selectElement.replaceChildren();
    subCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        selectElement.appendChild(option);
    });
        
    const existingOption = Array.from(selectElement.options)
    .find(option => option.value === value);

    // If option doesn't exist, create and append
    if (!existingOption) {
        const newOption = document.createElement('option');
        newOption.value = value;
        newOption.text = value;
        //newOption.setAttribute('data-customDisable', 'true');
        //newOption.style.display = 'none';
        //newOption.hidden = true;
        selectElement.appendChild(newOption);
        //selectElement.disabled = true;
    }

    selectElement.value = value;
    
    const option = document.createElement('option');
    option.value = "add_edit";
    option.text = "Add new / edit";
    option.classList.add('add_edit');
    const editModal = document.getElementById('editModal');
    const editModalTitle = document.getElementById('editModal-title');
    const editModalContent = document.getElementById('editModal-content');
    option.addEventListener('click', function() {
        console.log('Option clicked:', this.value);
        selectElement.value = subCategories[0];
        editModal.style.display = 'block';
        editModalTitle.innerText = "Add / Edit Sub-Categories"
        createList(editModalContent, subCategories);
    });

    selectElement.appendChild(option);
}

function loadTheSubCategoryData(element){
    let category = element.value;
    let elementId = element.id;
    elementId = "sub"+elementId;
    if (category != "add_edit") {
        const subCategories = dataList[category];
        const selectElement = document.getElementById(elementId);
        selectElement.replaceChildren();
        subCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.text = category;
            selectElement.appendChild(option);
        });  
        
        const option = document.createElement('option');
        option.value = "add_edit";
        option.text = "Add new / edit";
        option.classList.add('add_edit');
        const editModal = document.getElementById('editModal');
        const editModalTitle = document.getElementById('editModal-title');
        const editModalContent = document.getElementById('editModal-content');
        option.addEventListener('click', function() {
            console.log('Option clicked:', this.value);
            selectElement.value = subCategories[0];
            editModal.style.display = 'block';
            editModalTitle.innerText = "Add / Edit Sub-Categories"
            createList(editModalContent, subCategories);
        });

        selectElement.appendChild(option);
    }
}

function saveTheData(){
    const sets = document.querySelectorAll('#form > div');
    const allSetsData = [];
    dataList["DATA"]=[]
    sets.forEach(set => {
        const inputs = set.getElementsByClassName('expense-input');
        const setData = [];

        // Convert HTMLCollection to Array and map values
        Array.from(inputs).forEach(input => {
            if (input.type !== 'checkbox' && (input.type !== 'button'))
                setData.push(input.value);
        });

        // Only push non-empty sets
        if (setData.some(value => value !== '')) {
            dataList["DATA"].push(setData);
        }
    });

    console.log(dataList);
}
function downloadTheFormData() {
    saveTheData();
    const blob = new Blob([JSON.stringify(dataList, null, 2)], {
        type: 'application/json'
    });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expense_data_${new Date().toISOString().split('T')[0]}.json`;
    link.style.display = 'none';
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('form').addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        const checkbox = event.target;
        const inputs = checkbox.closest('.expense-set').querySelectorAll('.expense-input');

        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                // if (input.tagName.toLowerCase() === 'select') {
                //     // Check if any option has the data-customDisable attribute set to true
                //     const hasCustomDisable = Array.from(input.options).some(option => option.getAttribute('data-customDisable') === 'true');
                //     if (hasCustomDisable) {
                //         return; // Skip disabling this select element
                //     }
                // }
                input.disabled = !checkbox.checked; // Enable or disable based on checkbox state
            }
        });
    }
});

function loadTheSampleData(){
    const container = document.getElementById('form');
    container.innerHTML = '';
    dataList = returnDataList();
    let data = dataList['DATA'];
    data.forEach(dt => {
        addExpense(edit='true', disableList=['false','false','false','false','false'],dataset=dt);
    });
}

function loadTheFileData(){
    const container = document.getElementById('form');
    container.innerHTML = '';
    let data = dataList['DATA'];
    data.forEach(dt => {
        addExpense(edit='false', disableList=['false','false','false','false','false'],dataset=dt);
    });
}

function handleFileUpload(event) {
    dataList=[]
    return new Promise((resolve, reject) => {
        console.log('JSON File Reading...');
        console.log(event)
        const file = event.target.files[0];

        if (!file) return;

        if (file.type !== 'application/json') {
            alert('Please upload a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const uploadedData = JSON.parse(e.target.result);
                dataList = uploadedData;
                console.log("Uploaded Data:", JSON.stringify(uploadedData, null, 2));
                console.log('JSON File Read Successfully');
                console.log(dataList);
                loadTheFileData();
                resolve(dataList);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file');
                document.getElementById("loader-component").style.display = "none";
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}


function calculateExpense(){
    saveTheData();
    const analysisContainer = document.getElementById('analysis-container');

    analysisContainer.style.display = 'flex';
    const monthlyExpContainer = document.getElementById('monthly-exp');
    const overallExpContainer = document.getElementById('overall-exp');
    const overallCategoryExpContainer = document.getElementById('overall-category-exp');
    const overallSubCategoryExpContainer = document.getElementById('overall-subcategory-exp');

    const monthlyExp = calculateMonthlyExpense(dataList["DATA"]);
    const overallExp = calculateOverallExpense(dataList["DATA"]);
    const overallCategoryExp = calculateOverallCategoryExpenses(dataList["DATA"]);
    const overallSubCategoryExp = calculateOverallSubCategoryExpenses(dataList["DATA"]);

    monthlyExpContainer.innerHTML = "<h3>Current Month: "+monthlyExp+"</h3>";
    overallExpContainer.innerHTML = "<h3>Overall: "+overallExp+"</h3>";

    overallCategoryExpContainer.innerHTML = '';
    const tableHeader1 = document.createElement('h3');
    tableHeader1.innerText = "Category wise";
    overallCategoryExpContainer.appendChild(tableHeader1);
    overallCategoryExpContainer.appendChild(createTableFromMap(overallCategoryExp));
     //= "<h3>Category wise: "+overallCategoryExp+"</h3>";
     
    overallSubCategoryExpContainer.innerHTML = '';
    const tableHeader2 = document.createElement('h3');
    tableHeader2.innerText = "SubCategory wise";
    overallSubCategoryExpContainer.appendChild(tableHeader2);
    overallSubCategoryExpContainer.appendChild(createTableFromMap(overallSubCategoryExp));
    //"<h3>Subcategory wise: "+overallSubCategoryExp+"</h3>";

    analysisContainer.style.display = 'flex';
}

function createTableFromMap(dataMap) {
    // Create table element
    const table = document.createElement('table');
    table.style.border = '1px solid black';  // Table border
    table.style.borderCollapse = 'collapse'; // Merges cell borders

    const tbody = document.createElement('tbody');
    for (const [key, value] of Object.entries(dataMap)) {
        const row = document.createElement('tr');
        
        const keyCell = document.createElement('td');
        keyCell.textContent = key;
        keyCell.className = 'analysis-table-cell';
        
        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        valueCell.className = 'analysis-table-cell';
        
        row.appendChild(keyCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    
    return table;
}
