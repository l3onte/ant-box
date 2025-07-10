const api = 'https://686770e4e3fefb261edeaa36.mockapi.io';

async function validation(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
}

export async function getMovements() {
    try {
        const response = await fetch(`${api}/movement`);

        validation(response);

        const data = await response.json();
        return data;
    } catch (error) {
        return console.log(error);
    }
}

export async function newMovement(data) {
    try {
        const response = await fetch(`${api}/movement`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        validation(response);

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}

export async function deleteMovement(id) {
    try {
        const response = await fetch(`${api}/movement/${id}`, {
            method: 'DELETE'
        });

        validation(response);
    } catch (error) {
        console.log(error);
    }
}

export async function updateMovement(id, change) {
    try {
        const response = await fetch(`${api}/movement/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(change)
        });

        validation(response);
    } catch (error) {
        console.log(error);
    }
}

export async function newBuget(newBuget) {
    try {
        const response = await fetch(`${api}/budgets`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(newBuget)
        });

        validation(response);
    } catch (error) {
        console.log(error);
    }
}

export async function getBugets() {
    try {
        const response = await fetch(`${api}/budgets`);

        validation(response);
        const data = await response.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

export async function deleteBudget(id) {
    try {
        const response = await fetch(`${api}/budgets/${id}`, {
            method: 'DELETE',            
        });

        validation(response);
    } catch (error) {
        console.log(error);
    }
}

export async function updateBudget(id, change) {
    try {
        const response = await fetch(`${api}/budgets/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(change)
        });

        validation(response);
        alert("Update");
    } catch (error) {   
        console.log(error);
    }
}