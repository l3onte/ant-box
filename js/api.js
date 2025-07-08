const api = 'https://686770e4e3fefb261edeaa36.mockapi.io';

export async function getMovements() {
    try {
        const response = await fetch(`${api}/movement`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.log(error);
    }
}