import * as api from './api.js';
let balance = 0;

let modal = document.getElementById('modal-principal');
const modalTitle = document.querySelector('.modal__title');
const modalInputs = document.querySelector('.modal__inputs');
const modalFooter = document.querySelector('.modal__footer');

function modifyMovementModal() {
    modalTitle.innerHTML = `
        <h5>New Movement</h5>
    `;

    modalInputs.innerHTML = `
        <label for="description" class="modal__label">Description</label>
        <input type="text" class="modal__input" placeholder="Write a description">

        <select name="movement-type" id="movement-type" class="modal__input">
            <option selected>Select the movement type</option>
            <option value="increce">Increce</option>
            <option value="expense">Expense</option>
        </select>

        <select name="category" id="category" class="modal__input">
            <option selected>Select the category</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="rent">Rent</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="subscriptions">Subscription</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="gifts">Gifts</option>
            <option value="investments">Investments</option>
            <option value="refunds">Refunds</option>
            <option value="other">Other</option>
        </select>

        <label for="amount" class="modal__label">Amount</label>
        <input type="number" class="modal__input" placeholder="Write the amount">
    `;

    modalFooter.innerHTML = `
        <button class="modal__button reset--button">Reset</button>
        <button class="modal__button save--button" id="save-movement">Save</button>
    `
}

function modifyBudgetModal() {
    modalTitle.innerHTML = `
        <h5>New Budget</h5>
    `;

    modalInputs.innerHTML = `
        <select name="category" id="category" class="modal__input">
            <option selected>Select the category</option>
        </select>
        <label for="amount" class="modal__label">Amount</label>
        <input type="number" placeholder="Write the amount" id="amount" class="modal__input">
    
        <label for="month" class="modal__label">Month</label>
        <input type="number" min="1" max="12" placeholder="Introduce the Month" class="modal__input" id="month">
    `;

    modalFooter.innerHTML = `
        <button class="modal__button reset--button">Reset</button>
        <button class="modal__button save--button" id="save-budget">Save</button>
    `
}

export function openBudgetModal() {
    document.getElementById('new-budget__button').addEventListener('click', () => {
        modifyBudgetModal();
        modal.showModal();
    });
};

export function openMovementModal() {
    document.getElementById('new-movement__button').addEventListener('click', () => {
        modifyMovementModal();
        modal.showModal();
        extractMovementData();
    });
};

export function closeModal() {
    document.querySelector('.modal__close-button').addEventListener('click', () => {
        modal.close();
    });
};

export function showOptions() {
    document.querySelector('.options-button').addEventListener('click', () => {
        const options = document.querySelectorAll('.options__icons');

        options.forEach(button => {
            button.classList.toggle('show');
        });
    });
};

export async function showMovements() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ``;

    const data = await api.getMovements();

    data.forEach((movement, index) => {
        const row = document.createElement('tr');

        if (movement.type === 'expense') {
            balance -= movement.amount;
        } else {
            balance += movement.amount;
        }

        let signo = "";
        if (balance < 0) {
            signo = "negative";
        } else {
            signo = "positive";
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${movement.date}</td>
            <td>${movement.description}</td>
            <td class="movement-type-field">
                <strong class="movement-type ${movement.type}">
                   ${movement.type}
                </strong>
            </td>
            <td>${movement.category}</td>
            <td>${movement.amount}C$</td>
            <td>
                <strong class="${signo}">    
                    ${balance}$
                </strong>
            </td>
            <td class="actions-cell">
                <div class="options-container-table">
                    <button class="actions-button">☰</button>
                    <div class="dropdown hidden">
                        <button class="dropdown__option edit-btn" data-id="${movement.id}">✏️ Edit</button>
                        <button class="dropdown__option delete-btn" data-id="${movement.id}">🗑️ Delete</button>
                    </div>
                </div>
            </td>
        `
        tbody.appendChild(row);
    });
}

let movementListenerAdded = false;

export function extractMovementData() {
    if (movementListenerAdded) return;
    movementListenerAdded = true;

    modal.addEventListener('click', async (event) => {
        if (event.target && event.target.id === 'save-movement') {
            const description = document.querySelector('input[placeholder="Write a description"]').value;
            const type = document.getElementById('movement-type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.querySelector('input[placeholder="Write the amount"]').value);

            const date = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

            const movement = {
                date,
                description,
                type,
                category,
                amount
            };

            await api.newMovement(movement);
            modal.close();
            showMovements();
        }
    });
}

function fillEditModal(movement) {
    document.querySelector('input[placeholder="Write a description"]').value = movement.description;
    document.getElementById('movement-type').value = movement.type;
    document.getElementById('category').value = movement.category;
    document.querySelector('input[placeholder="Write the amount"]').value = movement.amount;
}

function extractEditMovement(id) {
    modal.addEventListener('click', async function handleEdit(event) {
        if (event.target && event.target.id === 'save-movement') {
            const description = document.querySelector('input[placeholder="Write a description"]').value;
            const type = document.getElementById('movement-type').value;
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.querySelector('input[placeholder="Write the amount"]').value);
            const date = new Date().toLocaleDateString('en-CA');

            const movement = { date, description, type, category, amount };

            await api.updateMovement(id, movement).then(() => {
                modal.close();
                balance = 0;
                showMovements();
                modal.removeEventListener('click', handleEdit);
            });
        }
    })
}

export function openOptions() {
    document.addEventListener('click', async (event) => {
        const allDropdowns = document.querySelectorAll('.dropdown');

        if (!event.target.closest('.options-container-table')) {
            allDropdowns.forEach(menu => menu.classList.add('hidden'));
            return;
        };

        if (event.target.classList.contains('actions-button')) {
            const menu = event.target.nextElementSibling;

            allDropdowns.forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });

            menu.classList.toggle('hidden');
        };

        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.dataset.id;

            if (confirm('Are you sure you want to delete this movement?')) {
                await api.deleteMovement(id);
                balance = 0;
                showMovements();
            }
        };

        if (event.target.classList.contains('edit-btn')) {
            const id = event.target.dataset.id;
            const data = await api.getMovements();
            const movement = data.find(m => m.id === id);

            if (!movement) return alert('Movement not found');

            modifyMovementModal();
            fillEditModal(movement);
            modal.showModal();

            extractEditMovement(id);
        }
    });
}